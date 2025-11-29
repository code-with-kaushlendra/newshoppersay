import React, { useState } from 'react';
import type { PurchaseRecord } from '../types';
import { TruckIcon, CreditCardIcon } from './IconComponents';
import { PurchaseHistoryItem } from './PurchaseHistoryItem';

interface OrdersPageProps {
  purchases: PurchaseRecord[];
  onLeaveReview: (purchase: PurchaseRecord) => void;
  onOpenReturnModal: (purchase: PurchaseRecord) => void;
  onCancelOrder: (purchase: PurchaseRecord) => void;
}

type OrderStatusFilter = 'all' | PurchaseRecord['orderStatus'];

export const OrdersPage: React.FC<OrdersPageProps> = ({ purchases, onLeaveReview, onOpenReturnModal, onCancelOrder }) => {
  const [filter, setFilter] = useState<OrderStatusFilter>('all');
  
  const filteredPurchases = purchases.filter(p => filter === 'all' || p.orderStatus === filter);
  
  const sortedPurchases = [...filteredPurchases].sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

  const FilterButton: React.FC<{ status: OrderStatusFilter, label: string }> = ({ status, label }) => (
    <button onClick={() => setFilter(status)} className={`px-4 py-2 text-sm font-medium rounded-md ${filter === status ? 'bg-secondary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
        {label}
    </button>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
        <div className="flex space-x-2 p-1 bg-gray-200 rounded-lg">
            <FilterButton status="all" label="All" />
            <FilterButton status="processing" label="Pending" />
            <FilterButton status="delivered" label="Delivered" />
            <FilterButton status="cancelled" label="Cancelled" />
        </div>
      </div>

      {sortedPurchases.length > 0 ? (
        <div className="space-y-4">
            {sortedPurchases.map(purchase => (
                <div key={purchase.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-t-md -m-4 mb-4 border-b">
                        <div className="text-sm">
                            <p>ORDER PLACED</p>
                            <p className="text-gray-600">{new Date(purchase.purchaseDate).toDateString()}</p>
                        </div>
                        <div className="text-sm text-right">
                            <p>TOTAL</p>
                            <p className="text-gray-600">₹{purchase.product.price.toLocaleString()}</p>
                        </div>
                    </div>
                    <PurchaseHistoryItem 
                        purchase={purchase}
                        onLeaveReview={onLeaveReview}
                        onOpenReturnModal={onOpenReturnModal}
                        onCancelOrder={onCancelOrder}
                    />
                </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <CreditCardIcon className="w-16 h-16 text-gray-300 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">You have no orders here</h2>
            <p className="mt-2 text-gray-500">Items you purchase will appear here.</p>
        </div>
      )}
    </div>
  );
};