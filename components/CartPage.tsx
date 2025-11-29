import React from 'react';
import type { Product } from '../types';
import { ShoppingBagIcon } from './IconComponents';

interface CartItemWithDetails extends Product {
    quantity: number;
}

interface CartPageProps {
  cartItems: CartItemWithDetails[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cartItems, onRemoveItem, onUpdateQuantity, onCheckout }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <main className="lg:w-2/3">
          <div className="bg-white shadow-sm rounded-lg">
            <div className="p-6 border-b">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            {cartItems.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <li key={item.id} className="p-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0">
                    <img src={item.imageUrls[0]} alt={item.title} className="w-32 h-32 object-cover rounded-md" />
                    <div className="ml-0 sm:ml-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                        <p className="text-sm text-gray-500">Sold by {item.seller.name}</p>
                        <p className="text-lg font-bold text-red-700 mt-2">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-4">
                        <select
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                          className="rounded-md border-gray-300 shadow-sm"
                          aria-label={`Quantity for ${item.title}`}
                        >
                          {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>Qty: {i+1}</option>)}
                        </select>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <button onClick={() => onRemoveItem(item.id)} className="text-sm text-blue-700 hover:underline">Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
                <div className="text-center py-16">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">Your Cart is Empty</h2>
                    <p className="mt-2 text-gray-500">Add some items to get started!</p>
                </div>
            )}
          </div>
        </main>

        {/* Subtotal & Checkout */}
        {cartItems.length > 0 && (
            <aside className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800">
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items): <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                </h2>
                <div className="mt-6">
                  <button
                    onClick={onCheckout}
                    className="w-full bg-primary text-secondary py-3 rounded-lg font-semibold hover:bg-accent transition-colors shadow-sm"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </aside>
        )}
      </div>
    </div>
  );
};
