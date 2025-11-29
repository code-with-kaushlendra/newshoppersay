
import React, { useState } from 'react';
import type { Product, User, Category } from '../types';
import { PostAdForm } from './PostAdForm'; // Repurposed as ProductForm
import { MyListings } from './MyListings';

interface BusinessDashboardProps {
  userProducts: Product[];
  onDeleteProduct: (productId: string) => void;
  onSaveProduct: (productData: Omit<Product, 'id' | 'postedDate' | 'seller' | 'status' | 'expiryDate'> & { id?: string }) => Promise<boolean> | void;
  currentUser: User;
  categories: Category[];
}

export const Dashboard: React.FC<BusinessDashboardProps> = ({ userProducts, onDeleteProduct, onSaveProduct, currentUser, categories }) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const handleShowForm = (product?: Product) => {
    setProductToEdit(product || null);
    setView('form');
  }

  const handleSave = async (productData: Omit<Product, 'id' | 'postedDate' | 'seller' | 'status' | 'expiryDate'> & { id?: string }) => {
    const success = await onSaveProduct(productData);
    if (success !== false) {
        setView('list');
        setProductToEdit(null);
    }
    return true;
  }
  
  const handleCancel = () => {
    setView('list');
    setProductToEdit(null);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
        {view === 'list' && (
            <button onClick={() => handleShowForm()} className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors">
                Post New Product
            </button>
        )}
      </div>

      {view === 'list' ? (
        <MyListings
          userProducts={userProducts}
          onDeleteProduct={onDeleteProduct}
          onEditProduct={handleShowForm}
        />
      ) : (
        <PostAdForm 
          categories={categories}
          currentUser={currentUser}
          onSaveProduct={handleSave}
          onCancel={handleCancel}
          productToEdit={productToEdit}
        />
      )}
    </div>
  );
};
