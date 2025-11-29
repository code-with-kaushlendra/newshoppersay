import React, { useState } from 'react';
import type { Product } from '../types';
import { supabase } from '../services/supabase';
import { CheckCircleIcon, SpinnerIcon } from './IconComponents';

const RAZORPAY_KEY_ID = 'rzp_live_RUv2nx9Eg3xoQf';

interface ListingFeePaymentModalProps {
  product: Product;
  onClose: () => void;
  onPaymentSuccess: (activatedProduct: Product) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const ListingFeePaymentModal: React.FC<ListingFeePaymentModalProps> = ({ product, onClose, onPaymentSuccess }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'verifying' | 'success'>('details');
  const [error, setError] = useState<string | null>(null);
  const LISTING_FEE = 199;

  const handlePayment = async () => {
    setError(null);
    if (!RAZORPAY_KEY_ID) {
      setError('Razorpay Key ID is not configured.');
      return;
    }

    setStep('processing');

    try {
      const { data: order, error: orderError } = await supabase.functions.invoke('create-listing-fee-order');

      if (orderError) throw orderError;
      if (order.error) throw new Error(order.error);

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'shopperssay - Listing Fee',
        description: `Fee for "${product.title}"`,
        order_id: order.id,
        handler: async (response: any) => {
          setStep('verifying');
          const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-listing-fee-payment', {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              listingId: product.id,
            }
          });

          if (verificationError) throw verificationError;
          if (verificationData.error) throw new Error(verificationData.error);
          
          if (verificationData.success) {
            onPaymentSuccess(verificationData.listing);
            setStep('success');
          } else {
            throw new Error('Payment verification failed.');
          }
        },
        theme: { color: '#f97316' },
        modal: {
          ondismiss: () => {
            if (step !== 'verifying' && step !== 'success') {
              setStep('details');
              setError('Payment was not completed.');
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error('Payment Error:', err);
      setError(err.message || 'An unexpected error occurred.');
      setStep('details');
    }
  };

  const isBusy = step === 'processing' || step === 'verifying';
  
  const renderContent = () => {
    switch (step) {
      case 'success':
        return (
          <div className="text-center p-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 id="modal-title" className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-600 mt-2">Your listing "{product.title}" is now active for 90 days.</p>
            <button
              onClick={onClose}
              className="w-full bg-primary text-white py-3 px-4 mt-8 rounded-md font-semibold hover:bg-orange-600 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        );
      case 'processing':
      case 'verifying':
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center h-64">
            <SpinnerIcon className="w-16 h-16 text-primary" />
            <h2 id="modal-title" className="text-2xl font-bold text-gray-800 mt-6">
              {step === 'verifying' ? 'Verifying Payment...' : 'Processing Payment...'}
            </h2>
            <p className="text-gray-600 mt-2">Please do not close this window.</p>
          </div>
        );
      case 'details':
      default:
        return (
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">Activate Your Listing</h2>
              <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
            </div>
            <p className="text-gray-600 mt-2">A one-time fee of ₹{LISTING_FEE} is required to make your ad visible to buyers for 90 days.</p>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
              <img src={product.imageUrls[0]} alt={product.title} className="w-16 h-16 rounded-md object-cover" />
              <div>
                <p className="font-semibold text-gray-700">{product.title}</p>
                <p className="text-lg font-bold text-primary">Listing Fee: ₹{LISTING_FEE}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">{error}</p>}
              <div className="pt-2">
                <button
                  onClick={handlePayment}
                  disabled={isBusy}
                  className="w-full bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                  Pay and Activate Listing
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">You will be redirected to Razorpay to complete your payment.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={!isBusy ? onClose : undefined}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
};