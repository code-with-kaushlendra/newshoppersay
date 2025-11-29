
import React, { useState } from 'react';
import type { Product } from '../types';
import { PencilIcon, TrashIcon } from './IconComponents';
import { ConfirmModal } from './ConfirmModal';

interface MyListingsProps {
  userProducts: Product[];
  onDeleteProduct: (productId: string) => void;
  onEditProduct: (product: Product) => void;
}

const StatusPill: React.FC<{ status: Product['status'] }> = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-800 border border-green-200',
    pending_payment: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    expired: 'bg-gray-200 text-gray-700 border border-gray-300',
    sold: 'bg-purple-100 text-purple-800 border border-purple-200',
  };
  const text = {
    active: 'Active',
    pending_payment: 'Pending',
    expired: 'Expired',
    sold: 'Sold',
  };
  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${styles[status]}`}>
      {text[status]}
    </span>
  );
};

export const MyListings: React.FC<MyListingsProps> = ({ userProducts, onDeleteProduct, onEditProduct }) => {
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  return (
    <>
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100" aria-labelledby="products-heading">
        <h2 id="products-heading" className="text-2xl font-bold text-gray-900 mb-6">Your Products ({userProducts.length})</h2>
        {userProducts.length > 0 ? (
            <div className="overflow-hidden ring-1 ring-black ring-opacity-5 md:rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {userProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 shadow-sm">
                                        <img className="h-full w-full object-cover object-center" src={product.imageUrls[0]} alt={product.title} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-semibold text-gray-900 truncate max-w-[150px] sm:max-w-xs text-base" title={product.title}>{product.title}</div>
                                        <div className="text-gray-500 text-xs mt-1 bg-gray-100 inline-block px-1.5 py-0.5 rounded">{product.category}</div>
                                    </div>
                            </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <StatusPill status={product.status} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900">
                                ₹{product.price.toLocaleString()}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex justify-end gap-3">
                                    <button 
                                        onClick={() => onEditProduct(product)} 
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 hover:text-indigo-800 transition-all shadow-sm border border-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        aria-label={`Edit ${product.title}`}
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(product.id)} 
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 hover:text-red-800 transition-all shadow-sm border border-red-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                        aria-label={`Delete ${product.title}`}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500 text-lg font-medium">You haven't posted any products yet.</p>
            <p className="text-gray-400 text-sm mt-2">Start selling by clicking the "Post New Product" button above.</p>
            </div>
        )}
        </section>
        
        <ConfirmModal 
            isOpen={!!productToDelete}
            onClose={() => setProductToDelete(null)}
            onConfirm={confirmDelete}
            title="Delete Listing"
            message="Are you sure you want to delete this listing? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
        />
    </>
  );
};
