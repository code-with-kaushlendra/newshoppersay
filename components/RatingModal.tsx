import React, { useState } from 'react';
import type { PurchaseRecord } from '../types';
import { StarIcon } from './IconComponents';

interface RatingModalProps {
  purchase: PurchaseRecord;
  onClose: () => void;
  onSubmit: (purchase: PurchaseRecord, rating: number, reviewText: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ purchase, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(purchase, rating, reviewText);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="rating-modal-title" className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
            <h2 id="rating-modal-title" className="text-2xl font-bold text-gray-800">Rate Your Purchase</h2>
            <p className="text-gray-600 mt-2">How was your experience with <span className="font-semibold">{purchase.product.seller.name}</span> for the item "{purchase.product.title}"?</p>
            
            <div className="my-8 flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                        aria-label={`Rate ${star} out of 5 stars`}
                    >
                        <StarIcon 
                            className={`w-10 h-10 cursor-pointer transition-colors ${
                                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        />
                    </button>
                ))}
            </div>

            <div className="text-left">
              <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-1">
                Review details (optional)
              </label>
              <textarea
                id="review-text"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Describe your experience with the seller and the item. Was the item as described? Was the seller helpful?"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
                <button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                    Submit Review
                </button>
            </div>
        </div>
      </div>
      
    </div>
  );
};