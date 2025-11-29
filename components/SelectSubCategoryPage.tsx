import React from 'react';
import type { Category } from '../types';
import { ChevronRightIcon } from './IconComponents';

interface SelectSubCategoryPageProps {
  parentCategory: Category;
  onSelectSubCategory: (subCategoryId: string) => void;
  onBack: () => void;
}

export const SelectSubCategoryPage: React.FC<SelectSubCategoryPageProps> = ({ parentCategory, onSelectSubCategory, onBack }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center text-md text-gray-500 mb-4">
          <button onClick={onBack} className="hover:underline text-primary">All Categories</button>
          <ChevronRightIcon className="w-5 h-5 mx-1 text-gray-400" />
          <span className="font-semibold text-gray-700">{parentCategory.name}</span>
        </div>
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Select a Sub-Category</h1>
            <p className="mt-2 text-lg text-gray-600">Get more specific to attract the right buyers.</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {parentCategory.subCategories?.map((subCategory) => (
           <button
            key={subCategory.id}
            onClick={() => onSelectSubCategory(subCategory.id)}
            className="group aspect-square bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden relative"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundImage: `url(${subCategory.icon})` }}
              aria-hidden="true"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <span className="absolute bottom-4 left-4 right-4 font-semibold text-white text-center text-lg">{subCategory.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};