
import React, { useState, useEffect } from 'react';
import { ProductCard } from './ListingCard';
import { CategoryPills } from './CategoryPills';
import type { Product, Category, User } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';

interface HomeProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onViewDetails: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  currentUser: User;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

const Banners = () => {
  const banners = [
    {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Super Summer Sale",
      offer: "Up to 50% OFF",
      subtitle: "On Latest Fashion Trends"
    },
    {
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Tech Upgrades",
      offer: "Flat 30% OFF",
      subtitle: "Laptops, Mobiles & Accessories"
    },
    {
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Home Essentials",
      offer: "New Arrivals",
      subtitle: "Refresh your space"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative w-full h-[200px] md:h-[360px] bg-gray-900 overflow-hidden group shadow-md">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Enhanced Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
          
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          
          {/* Flexbox Layout for Content Alignment */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-start justify-center h-full max-w-xl space-y-2 md:space-y-4 text-white">
                {/* Offer Pill */}
                <div className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded bg-accent text-secondary text-[10px] md:text-xs font-bold uppercase tracking-wide shadow-sm">
                   {banner.offer}
                </div>
                
                {/* Titles */}
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                    {banner.title}
                    </h2>
                    <p className="text-sm md:text-lg text-gray-100 font-medium drop-shadow-sm line-clamp-2 md:line-clamp-none">
                    {banner.subtitle}
                    </p>
                </div>

                {/* Action Button */}
                <button className="mt-2 bg-primary hover:bg-orange-600 text-white px-5 py-1.5 md:px-8 md:py-3 rounded-full font-bold text-xs md:text-sm transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ring-2 ring-transparent focus:ring-white">
                  Shop Now
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 md:p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10 hover:border-white/30 focus:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 md:p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10 hover:border-white/30 focus:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full shadow-sm ${
              index === currentSlide ? 'bg-primary w-6 h-1.5 md:w-8 md:h-2' : 'bg-white/50 hover:bg-white/80 w-1.5 h-1.5 md:w-2 md:h-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export const Home: React.FC<HomeProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onViewDetails,
  onBuyNow,
  currentUser,
  wishlist,
  onToggleWishlist
}) => {
  
  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Banners />
      
      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Fresh Recommendations</h2>
          
          <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end w-full sm:w-auto">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{products.length} items found</span>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onBuyNow={onBuyNow}
                currentUser={currentUser}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ChevronRightIcon className="w-8 h-8 text-gray-400 rotate-90" />
            </div>
            <p className="text-gray-600 text-lg font-medium">No products found.</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters to see more items.</p>
            {(selectedCategory) && (
                <button 
                onClick={() => {
                    if (selectedCategory) onSelectCategory(null);
                }}
                className="mt-4 text-primary hover:underline font-medium"
                >
                Clear all filters
                </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
