
import React, { useState, useMemo } from 'react';
import type { Product } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface AdminPostsProps {
  products: Product[];
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void;
}

export const AdminPosts: React.FC<AdminPostsProps> = ({ products, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const confirmDelete = () => {
    if (productToDelete) {
        onDelete(productToDelete);
        setProductToDelete(null);
    }
  };

  return (
    <>
        <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Posts ({products.length})</h2>
        <div className="mb-4">
            <label htmlFor="post-search" className="sr-only">Search by title or seller name</label>
            <input
            type="text"
            id="post-search"
            placeholder="Search by title or seller name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm bg-gray-100 border border-transparent rounded-md py-2 px-4 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary"
            />
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <caption className="sr-only">List of all user posts with actions to edit or delete.</caption>
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(product => (
                <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrls[0]} alt={product.title} />
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.location}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.seller.name}</div>
                    <div className="text-sm text-gray-500">{product.seller.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-primary">₹{product.price.toLocaleString()}</span >
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.postedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => onEdit(product)} aria-label={`Edit post titled ${product.title}`} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => setProductToDelete(product.id)} aria-label={`Delete post titled ${product.title}`} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        {filteredProducts.length === 0 && <p className="text-center text-gray-500 py-8">No listings found.</p>}
        </div>

        <ConfirmModal 
            isOpen={!!productToDelete}
            onClose={() => setProductToDelete(null)}
            onConfirm={confirmDelete}
            title="Delete Post"
            message="Are you sure you want to delete this post? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
        />
    </>
  );
};
