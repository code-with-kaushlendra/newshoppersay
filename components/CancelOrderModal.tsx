import React, { useState } from 'react';
import type { PurchaseRecord } from '../types';

interface CancelOrderModalProps {
  purchase: PurchaseRecord;
  onClose: () => void;
  onSubmit: (purchase: PurchaseRecord, reason: string, comments: string) => void;
}

const CANCEL_REASONS = [
    "Ordered by mistake",
    "Item no longer needed",
    "Incorrect shipping address",
    "Found a better price elsewhere",
    "Other (please specify below)",
];

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ purchase, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
        alert('Please select a reason for cancellation.');
        return;
    }
    onSubmit(purchase, reason, comments);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title" className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h2 id="cancel-modal-title" className="text-2xl font-bold text-gray-800">Cancel Your Order</h2>
                    <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                <p className="text-gray-600 mt-2">You are requesting to cancel the following item:</p>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-lg flex items-center space-x-4 border">
                    <img src={purchase.product.imageUrls[0]} alt={purchase.product.title} className="w-16 h-16 rounded-md object-cover" />
                    <div>
                        <p className="font-semibold text-gray-700">{purchase.product.title}</p>
                        <p className="text-lg font-bold text-primary">Rs {purchase.product.price.toLocaleString()}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for cancellation</label>
                    <select
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        <option value="" disabled>-- Select a reason --</option>
                        {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                    Comments (optional)
                  </label>
                  <textarea
                    id="comments"
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Provide more details if needed."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 rounded-b-lg">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors"
                >
                    Keep Order
                </button>
                <button
                    type="submit"
                    className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
                >
                    Confirm Cancellation
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};