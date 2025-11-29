import React, { useState } from 'react';
import type { User, Product } from '../types';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminUsers } from './AdminUsers';
import { AdminPosts } from './AdminPosts';

interface AdminDashboardProps {
  allUsers: User[];
  allProducts: Product[];
  onDeleteUser: (userId: number) => void;
  onEditUser: (user: User) => void;
  onDeleteProduct: (productId: string) => void;
  onEditProduct: (product: Product) => void;
}

type AdminView = 'analytics' | 'users' | 'posts';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ allUsers, allProducts, onDeleteUser, onEditUser, onDeleteProduct, onEditProduct }) => {
  const [view, setView] = useState<AdminView>('analytics');

  const NavItem: React.FC<{ label: string; currentView: AdminView, targetView: AdminView, onClick: () => void }> = ({ label, currentView, targetView, onClick }) => (
    <button
      onClick={onClick}
      aria-current={currentView === targetView ? 'page' : undefined}
      className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
        currentView === targetView ? 'bg-primary text-white' : 'text-gray-600 hover:bg-orange-100 hover:text-primary'
      }`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    switch (view) {
      case 'users':
        return <AdminUsers users={allUsers} onDelete={onDeleteUser} onEdit={onEditUser} />;
      case 'posts':
        return <AdminPosts products={allProducts} onDelete={onDeleteProduct} onEdit={onEditProduct} />;
      case 'analytics':
      default:
        return <AdminAnalytics users={allUsers} products={allProducts} />;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 lg:w-1/5">
          <nav aria-label="Admin sections" className="bg-white p-4 rounded-lg shadow-md space-y-2">
            <NavItem label="Analytics" currentView={view} targetView="analytics" onClick={() => setView('analytics')} />
            <NavItem label="Manage Users" currentView={view} targetView="users" onClick={() => setView('users')} />
            <NavItem label="Manage Posts" currentView={view} targetView="posts" onClick={() => setView('posts')} />
          </nav>
        </aside>
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};