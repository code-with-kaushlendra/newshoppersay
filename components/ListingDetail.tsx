
import React, { useState } from 'react';
import type { Product, User } from '../types';
import { HeartIcon, ShoppingBagIcon } from './IconComponents';
import { StarRating } from './StarRating';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onBuyNow: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 text-sm text-gray-500">{label}</td>
      <td className="py-2 text-sm font-medium text-gray-800">{value}</td>
    </tr>
  );
};

export const ListingDetail: React.FC<ProductDetailProps> = ({ product, onBack, onBuyNow, wishlist, onToggleWishlist }) => {
  const [activeMedia, setActiveMedia] = useState<number>(0);
  const isInWishlist = wishlist.includes(product.id);

  const hasDetails = product.details && Object.values(product.details).some(v => v);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={onBack} className="mb-6 text-sm text-blue-700 hover:underline">
          &larr; Back to results
        </button>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="lg:w-2/5">
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center h-96">
                <img 
                  src={product.imageUrls[activeMedia]} 
                  alt={`${product.title} - image ${activeMedia + 1}`} 
                  className="max-w-full max-h-full object-contain" 
                  onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=No+Image';
                  }}
                />
              </div>
              {product.imageUrls.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {product.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveMedia(index)}
                      className={`rounded-md overflow-hidden h-16 w-16 flex-shrink-0 block focus:outline-none border-2 ${
                        activeMedia === index ? 'border-primary' : 'border-gray-300'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img 
                        src={url} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=No+Img';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Product Info */}
          <div className="lg:w-2/5">
            <h1 className="text-3xl font-semibold text-gray-900">{product.title}</h1>
             <div className="flex items-center mt-2">
                {product.seller.rating && (
                    <div className="flex items-center">
                        <StarRating rating={product.seller.rating.average} size="base" />
                        <span className="text-sm text-blue-700 ml-2 hover:underline cursor-pointer">{product.seller.rating.count} ratings</span>
                    </div>
                )}
            </div>
            <div className="my-4 border-t border-gray-200"></div>
            <p className="text-3xl font-medium text-red-700">₹{product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">All prices include VAT</p>

            <section className="mt-6" aria-labelledby="description-heading">
              <h2 id="description-heading" className="text-xl font-semibold text-gray-800 mb-2">About this item</h2>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{product.description}</p>
            </section>
          </div>
          {/* Add to Cart Panel */}
          <div className="lg:w-1/5">
             <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-2xl font-medium text-red-700">₹{product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-2">In Stock.</p>
                <p className="text-sm text-gray-600">Sold by <span className="text-blue-700">{product.seller.name}</span></p>

                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={() => onBuyNow(product)}
                    className="w-full bg-primary text-white py-2.5 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    Buy Now
                  </button>
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`w-full border py-2.5 rounded-full font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 ${
                    isInWishlist 
                    ? 'bg-red-100 border-red-200 text-red-600' 
                    : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                    }`}
                >
                    <HeartIcon className={`w-5 h-5 ${isInWishlist ? 'fill-current' : 'fill-none'}`} />
                    {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {hasDetails && (
             <section className="mt-12 pt-6 border-t" aria-labelledby="specs-heading">
                <h2 id="specs-heading" className="text-xl font-semibold text-gray-800 mb-4">Product specifications</h2>
                <table className="w-full max-w-2xl">
                    <tbody>
                        <DetailItem label="Brand" value={product.details?.brand} />
                        <DetailItem label="Condition" value={product.details?.condition} />
                        <DetailItem label="Year" value={product.details?.year} />
                        <DetailItem label="Material" value={product.details?.material} />
                    </tbody>
                </table>
            </section>
        )}
      </div>
    </div>
  );
};
