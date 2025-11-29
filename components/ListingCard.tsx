
import React from 'react';
import type { Product, User } from '../types';
import { StarRating } from './StarRating';
import { HeartIcon, MapPinIcon, ShoppingBagIcon } from './IconComponents';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  currentUser: User;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onBuyNow, currentUser, wishlist, onToggleWishlist }) => {
  const isInWishlist = wishlist.includes(product.id);
  
  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onBuyNow(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewDetails(product);
    }
  };
  
  return (
    <article
      onClick={() => onViewDetails(product)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`View details for ${product.title}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group flex flex-col focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-gray-200 hover:shadow-lg"
    >
      <div className="relative h-48 bg-gray-200">
        <img 
            src={product.imageUrls[0]} 
            alt={product.title} 
            className="w-full h-full object-cover" 
            onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
            }}
        />
        <button
            onClick={handleWishlistClick}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-red-500 transition-colors z-10"
        >
            <HeartIcon className={`w-6 h-6 ${isInWishlist ? 'text-red-500 fill-current' : 'fill-none'}`} />
        </button>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-md font-medium text-gray-800 group-hover:text-primary transition-colors flex-grow">{product.title}</h3>
        <div className="flex items-center mt-2">
            {product.seller.rating && (
                <div className="flex items-center">
                    <StarRating rating={product.seller.rating.average} size="sm" />
                    <span className="text-xs text-gray-500 ml-1.5">({product.seller.rating.count})</span>
                </div>
            )}
        </div>
        <p className="text-xl font-bold text-gray-900 mt-1">₹{product.price.toLocaleString()}</p>
      </div>
      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={handleBuyNowClick}
          className="w-full bg-accent text-secondary py-2 rounded-lg text-sm font-semibold hover:bg-primary transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          aria-label={`Buy ${product.title} now`}
        >
          <ShoppingBagIcon className="w-4 h-4" />
          Buy Now
        </button>
      </div>
    </article>
  );
};
