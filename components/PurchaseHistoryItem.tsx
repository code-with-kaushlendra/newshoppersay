import React from 'react';
import type { PurchaseRecord } from '../types';
import { TruckIcon } from './IconComponents';

interface PurchaseHistoryItemProps {
    purchase: PurchaseRecord;
    onLeaveReview: (purchase: PurchaseRecord) => void;
    onOpenReturnModal: (purchase: PurchaseRecord) => void;
    onCancelOrder: (purchase: PurchaseRecord) => void;
}

export const PurchaseHistoryItem: React.FC<PurchaseHistoryItemProps> = ({ purchase, onLeaveReview, onOpenReturnModal, onCancelOrder }) => {
    
    const isReturnable = () => {
        if (purchase.orderStatus === 'cancelled' || purchase.orderStatus === 'returned') return false;
        const purchaseDate = new Date(purchase.purchaseDate);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return purchaseDate > sevenDaysAgo;
    };

    const isCancellable = () => {
        if (purchase.orderStatus !== 'processing') {
            return false;
        }
        const purchaseDate = new Date(purchase.purchaseDate);
        const oneDay = 24 * 60 * 60 * 1000;
        return (new Date().getTime() - purchaseDate.getTime()) < oneDay;
    };

    const renderReturnButton = () => {
        if (purchase.orderStatus === 'returned') {
            return (
                <div className="text-sm text-blue-600 font-semibold">
                    Return Requested
                </div>
            );
        }
        
        if (isReturnable()) {
            return (
                <button 
                    onClick={() => onOpenReturnModal(purchase)}
                    className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-md hover:bg-gray-300 font-semibold transition-colors"
                >
                    Request Return
                </button>
            );
        }

        return (
             <button 
                disabled
                className="bg-gray-100 text-gray-400 px-3 py-1 text-sm rounded-md cursor-not-allowed"
            >
                Return Window Closed
            </button>
        );
    };

    const renderReviewButton = () => {
        if (purchase.reviewSubmitted) {
            return (
                <div className="flex items-center justify-start sm:justify-end gap-1 text-sm text-green-600">
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Review Submitted</span>
                </div>
            );
        }
        return (
            <button 
                onClick={() => onLeaveReview(purchase)}
                className="bg-orange-100 text-primary px-3 py-1 text-sm rounded-md hover:bg-orange-200 font-semibold transition-colors"
            >
                Leave a Review
            </button>
        );
    };

    return (
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 py-4">
            <img src={purchase.product.imageUrls[0]} alt={purchase.product.title} className="w-24 h-24 sm:w-20 sm:h-20 rounded-md object-cover flex-shrink-0" />
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{purchase.product.title}</h3>
                <p className="text-primary font-bold">₹{purchase.product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Sold by {purchase.product.seller.name}</p>
                <p className="text-sm text-gray-500 mt-1">Purchased on {purchase.purchaseDate}</p>
                {purchase.orderStatus === 'cancelled' && purchase.cancellationReason && (
                    <p className="text-sm text-gray-500 mt-1 italic">Reason: "{purchase.cancellationReason}"</p>
                )}
                {purchase.orderStatus === 'returned' && purchase.returnReason && (
                    <p className="text-sm text-gray-500 mt-1 italic">Return Reason: "{purchase.returnReason}"</p>
                )}
                {purchase.arrivalDate && purchase.orderStatus !== 'cancelled' && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-700 bg-green-50 p-2 rounded-md w-fit">
                        <TruckIcon className="w-5 h-5 flex-shrink-0" />
                        <p className="font-semibold">
                            Estimated Arrival: {new Date(purchase.arrivalDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                )}
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto flex sm:flex-col items-center sm:items-end gap-2">
                {purchase.orderStatus === 'cancelled' ? (
                    <div className="text-sm text-red-600 font-semibold p-2 bg-red-50 rounded-md border border-red-200 w-full text-center sm:text-right">
                        Order Cancelled
                    </div>
                ) : (
                    <>
                        {renderReviewButton()}
                        {renderReturnButton()}
                        {isCancellable() && (
                            <button
                                onClick={() => onCancelOrder(purchase)}
                                className="bg-red-100 text-red-700 px-3 py-1 text-sm rounded-md hover:bg-red-200 font-semibold transition-colors"
                            >
                                Cancel Order
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};