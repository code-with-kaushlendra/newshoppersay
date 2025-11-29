import React from 'react';
import type { Product } from '../types';
import { HeartIcon } from './IconComponents';

interface WishlistPageProps {
  wishlistItems: Product[];
  onViewDetails: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ wishlistItems, onViewDetails, onRemoveFromWishlist }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
      
      {wishlistItems.length > 0 ? (
        <section className="bg-white p-6 rounded-lg shadow-md" aria-labelledby="wishlist-heading">
          <h2 id="wishlist-heading" className="sr-only">Items in your wishlist</h2>
          <ul className="space-y-4">
            {wishlistItems.map(product => (
              <li key={product.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0 flex-grow">
                  <img src={product.imageUrls[0]} alt={product.title} className="w-20 h-20 rounded-md object-cover" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
                    <p className="text-primary font-bold">₹{product.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{product.location}</p>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button onClick={() => onViewDetails(product)} className="bg-gray-200 text-gray-800 px-4 py-2 text-sm rounded-md hover:bg-gray-300 font-semibold transition-colors">View Details</button>
                  <button 
                    onClick={() => onRemoveFromWishlist(product.id)}
                    aria-label={`Remove ${product.title} from wishlist`}
                    className="bg-red-100 text-red-700 px-4 py-2 text-sm rounded-md hover:bg-red-200 font-semibold transition-colors flex items-center gap-2"
                  >
                    <HeartIcon className="w-4 h-4 fill-current" />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <HeartIcon className="w-16 h-16 text-gray-300 mx-auto fill-none" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-500">Click the heart icon on any item to save it here.</p>
        </div>
      )}
    </div>
  );
};
