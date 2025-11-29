import React from 'react';
import type { User, Product } from '../types';
import { UserIcon, ShoppingBagIcon } from './IconComponents';

interface AdminAnalyticsProps {
  users: User[];
  products: Product[];
}

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-orange-100 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ users, products }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard 
          title="Total Users" 
          value={users.length} 
          icon={<UserIcon className="w-8 h-8 text-primary" />} 
        />
        <StatCard 
          title="Total Products" 
          value={products.length} 
          icon={<ShoppingBagIcon className="w-8 h-8 text-primary" />} 
        />
      </div>
    </div>
  );
};