import React from 'react';
import type { Category } from '../types';

interface SelectCategoryPageProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export const SelectCategoryPage: React.FC<SelectCategoryPageProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900">What are you offering?</h1>
        <p className="mt-2 text-lg text-gray-600">Choose a category to get started with your ad.</p>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="group aspect-square bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden relative"
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
    </div>
  );
};