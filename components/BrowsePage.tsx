import React, { useState, useMemo } from 'react';
import type { Product, Category, User } from '../types';
import { ProductCard } from './ListingCard';
import { ChevronRightIcon } from './IconComponents';

interface BrowsePageProps {
    categories: Category[];
    products: Product[];
    onViewDetails: (product: Product) => void;
    onBuyNow: (product: Product) => void;
    currentUser: User;
    wishlist: string[];
    onToggleWishlist: (productId: string) => void;
}

type SubCategory = {
    id: string;
    name: string;
    icon: string;
};

const CategoryGrid: React.FC<{
    categories: (Category | SubCategory)[];
    onSelect: (category: Category | SubCategory) => void;
}> = ({ categories, onSelect }) => (
     <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {categories.map((category) => (
            <button
                key={category.id}
                onClick={() => onSelect(category)}
                className="group aspect-square bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden relative"
                aria-label={`Browse ${category.name}`}
            >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.icon})` }}
                  aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <span className="absolute bottom-4 left-4 right-4 font-semibold text-white text-center text-lg">{category.name}</span>
            </button>
        ))}
    </div>
);


export const BrowsePage: React.FC<BrowsePageProps> = ({ categories, products, onViewDetails, onBuyNow, currentUser, wishlist, onToggleWishlist }) => {
    const [parentCategory, setParentCategory] = useState<Category | null>(null);
    const [finalCategory, setFinalCategory] = useState<Category | SubCategory | null>(null);

    const activeProducts = useMemo(() => products.filter(l => l.status === 'active'), [products]);

    const handleSelect = (category: Category) => {
        if (category.subCategories && category.subCategories.length > 0) {
            setParentCategory(category);
        } else {
            setFinalCategory(category);
        }
    };

    const handleSelectSub = (subCategory: SubCategory) => {
        setFinalCategory(subCategory);
    };

    const resetToMain = () => {
        setParentCategory(null);
        setFinalCategory(null);
    };

    const resetToParent = () => {
        setFinalCategory(null);
    }
    
    const getBackFunction = () => {
       if (finalCategory && parentCategory) {
           return resetToParent;
       }
       return resetToMain;
    };

    const filteredProducts = useMemo(() => {
        if (!finalCategory) return [];

        const parentWithSubCats = categories.find(c => c.id === finalCategory.id && c.subCategories);
        if (parentWithSubCats) {
            const subCategoryIds = parentWithSubCats.subCategories!.map(sc => sc.id);
            return activeProducts.filter(l => l.category === parentWithSubCats.id || subCategoryIds.includes(l.category));
        }
        
        return activeProducts.filter(l => l.category === finalCategory.id);
    }, [activeProducts, finalCategory, categories]);

    // View 1: Show listings for a final category
    if (finalCategory) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={getBackFunction()} className="mb-6 text-primary font-semibold hover:underline">
                    &larr; Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Showing results for "{finalCategory.name}"</h1>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredProducts.map(product => (
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
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800">No Items Found</h2>
                        <p className="mt-2 text-gray-500">There are currently no listings in the "{finalCategory.name}" category.</p>
                    </div>
                )}
            </div>
        );
    }
    
    // View 2: Show sub-categories
    if (parentCategory) {
        const subCategoriesToDisplay = parentCategory.subCategories || [];

         return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center text-md text-gray-500 mb-4">
                        <button onClick={resetToMain} className="hover:underline text-primary">All Categories</button>
                        <ChevronRightIcon className="w-5 h-5 mx-1 text-gray-400" />
                        <span className="font-semibold text-gray-700">{parentCategory.name}</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Browse Sub-Categories</h1>
                        <p className="mt-2 text-lg text-gray-600">Select a sub-category to view listings.</p>
                    </div>
                </div>
                <CategoryGrid categories={subCategoriesToDisplay} onSelect={handleSelectSub as (category: Category | SubCategory) => void} />
            </div>
        );
    }

    // View 3: Show main categories
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-gray-900">Browse by Category</h1>
                <p className="mt-2 text-lg text-gray-600">Find what you're looking for by selecting a category below.</p>
            </div>
            <CategoryGrid categories={categories} onSelect={handleSelect as (category: Category | SubCategory) => void} />
        </div>
    );
};