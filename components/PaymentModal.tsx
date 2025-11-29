

import React, { useState } from 'react';
import type { Product, User, PurchaseRecord } from '../types';
import { supabase } from '../services/supabase';
import { CheckCircleIcon, SpinnerIcon } from './IconComponents';

// --- IMPORTANT ---
// This key is provided for the Razorpay integration.
const RAZORPAY_KEY_ID = 'rzp_live_RUv2nx9Eg3xoQf';

interface PaymentModalProps {
  product: Product;
  currentUser: User;
  onClose: () => void;
  onPaymentSuccess: (purchase: PurchaseRecord) => void;
}

// Define Razorpay on the window object for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ product, currentUser, onClose, onPaymentSuccess }) => {
  const [step, setStep] = useState<'details' | 'processingPayment' | 'verifying' | 'success'>('details');
  const [error, setError] = useState<string | null>(null);
  const [shippingDetails, setShippingDetails] = useState({
    phone: currentUser.phone || '',
    address: currentUser.address || '',
  });

  const handlePayment = async () => {
    setError(null);
    
    // Improved check for Razorpay Key ID
    if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.trim() === '') {
        setError('Razorpay Key ID is not configured correctly.');
        setStep('details');
        return;
    }

    setStep('processingPayment');

    try {
      // Step 1: Create an order server-side using a Supabase Edge Function
      const { data: order, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: product.price, currency: 'INR' },
      });

      if (orderError) throw orderError;
      if (order.error) throw new Error(order.error);

      // Step 2: Open Razorpay Checkout modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'shopperssay',
        description: `Purchase of "${product.title}"`,
        order_id: order.id,
        handler: async (response: any) => {
          // Step 3: Verify the payment server-side
          setStep('verifying');
          const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              listing: product,
              buyerId: currentUser.id,
            }
          });

          if (verificationError) throw verificationError;
          if (verificationData.error) throw new Error(verificationData.error);
          
          if (verificationData.success) {
            onPaymentSuccess(verificationData.purchase);
            setStep('success');
          } else {
            throw new Error('Payment verification failed.');
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
          contact: shippingDetails.phone,
        },
        notes: {
          address: shippingDetails.address,
        },
        theme: {
          color: '#f97316',
        },
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
  
  const isBusy = step === 'processingPayment' || step === 'verifying';

  const renderContent = () => {
    switch(step) {
      case 'success':
        return (
          <div className="text-center p-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 id="modal-title" className="text-2xl font-bold text-gray-800">Order Placed Successfully!</h2>
            <p className="text-gray-600 mt-2">Your purchase of "{product.title}" is complete.</p>
            <button
              onClick={onClose}
              className="w-full bg-primary text-white py-3 px-4 mt-8 rounded-md font-semibold hover:bg-orange-600 transition-colors"
            >
              Done
            </button>
          </div>
        );
      
      case 'processingPayment':
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
                    <h2 id="modal-title" className="text-2xl font-bold text-gray-800">Confirm Your Order</h2>
                    <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                    <img src={product.imageUrls[0]} alt={product.title} className="w-16 h-16 rounded-md object-cover" />
                    <div>
                        <p className="font-semibold text-gray-700">{product.title}</p>
                        <p className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</p>
                    </div>
                </div>
                <div className="mt-6 space-y-4">
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="e.g., (555) 123-4567"
                            value={shippingDetails.phone}
                            onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                        <textarea
                            id="address"
                            rows={3}
                            placeholder="e.g., 123 Main St, Anytown, USA 12345"
                            value={shippingDetails.address}
                            onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">{error}</p>}
                    <div className="pt-2">
                        <button 
                            onClick={handlePayment}
                            disabled={!shippingDetails.address || !shippingDetails.phone || isBusy}
                            className="w-full bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                        >
                            Proceed to Pay ₹{product.price.toLocaleString()}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">You will be redirected to Razorpay to complete your payment.</p>
                </div>
            </div>
        );
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={!isBusy ? onClose : undefined}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
};