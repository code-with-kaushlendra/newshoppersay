
import React, { useRef, useState, useEffect } from 'react';
import type { Category } from '../types';
import { 
    ChevronLeftIcon, 
    ChevronRightIcon,
    CarIcon,
    BuildingOfficeIcon,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    BriefcaseIcon,
    BikeIcon,
    DeviceTabletIcon,
    TruckIcon,
    FurnitureIcon,
    TShirtIcon,
    BookOpenIcon,
    PawIcon,
    WrenchIcon
} from './IconComponents';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const IconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    'CarIcon': CarIcon,
    'BuildingOfficeIcon': BuildingOfficeIcon,
    'DevicePhoneMobileIcon': DevicePhoneMobileIcon,
    'ComputerDesktopIcon': ComputerDesktopIcon,
    'BriefcaseIcon': BriefcaseIcon,
    'BikeIcon': BikeIcon,
    'DeviceTabletIcon': DeviceTabletIcon,
    'TruckIcon': TruckIcon,
    'FurnitureIcon': FurnitureIcon,
    'TShirtIcon': TShirtIcon,
    'BookOpenIcon': BookOpenIcon,
    'PawIcon': PawIcon,
    'WrenchIcon': WrenchIcon,
};

export const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(hasOverflow && el.scrollLeft < (el.scrollWidth - el.clientWidth - 5));
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const timeoutId = setTimeout(checkForScroll, 100);
      el.addEventListener('scroll', checkForScroll);
      window.addEventListener('resize', checkForScroll);

      return () => {
        clearTimeout(timeoutId);
        el.removeEventListener('scroll', checkForScroll);
        window.removeEventListener('resize', checkForScroll);
      };
    }
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.6;
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 bg-white border-b border-gray-100 shadow-sm mb-4">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative group">
          
          <h2 className="text-xl font-bold text-left text-gray-900 mb-4 px-2">Browse by Category</h2>

          {/* Left Fade Gradient */}
          {canScrollLeft && (
            <div className="absolute left-0 top-10 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block" />
          )}
          
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="hidden md:flex absolute left-0 top-[60%] -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md border border-gray-100 text-gray-600 hover:text-primary hover:scale-110 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex space-x-3 sm:space-x-5 overflow-x-auto px-2 pb-4 scrollbar-hide scroll-smooth items-start"
          >
            {categories.map((category) => {
               const isSelected = selectedCategory === category.id;
               const IconComponent = category.iconName ? IconMap[category.iconName] : null;

               return (
                  <button
                    key={category.id}
                    onClick={() => onSelectCategory(isSelected ? null : category.id)}
                    className="flex-shrink-0 flex flex-col items-center group focus:outline-none w-20 sm:w-24"
                  >
                    {/* Square Icon/Image Container */}
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-md transition-all duration-300 flex items-center justify-center border overflow-hidden ${
                        isSelected 
                        ? 'bg-primary/10 border-primary ring-2 ring-primary ring-offset-2 shadow-md scale-105 text-primary' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 hover:text-primary'
                    }`}>
                        {category.icon ? (
                             <img 
                                src={category.icon} 
                                alt={category.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : IconComponent ? (
                            <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 transition-colors" />
                        ) : (
                            <span className="text-xs">No Img</span>
                        )}
                    </div>
                    <span className={`mt-2 text-[11px] sm:text-xs font-medium text-center transition-colors duration-200 px-1 leading-tight line-clamp-2 h-8 flex items-start justify-center ${
                        isSelected ? 'text-primary font-bold' : 'text-gray-700 group-hover:text-primary'
                    }`}>
                        {category.name}
                    </span>
                  </button>
               );
            })}
            
            {/* View All Button */}
             <button
                onClick={() => onSelectCategory(null)}
                className="flex-shrink-0 flex flex-col items-center group focus:outline-none w-20 sm:w-24"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 shadow-sm">
                     <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-primary transition-colors" />
                </div>
                <span className="mt-2 text-[11px] sm:text-xs font-medium text-center text-gray-700 group-hover:text-primary transition-colors duration-200 px-1 leading-tight h-8 flex items-start justify-center">
                    View All
                </span>
              </button>
          </div>

          {/* Right Fade Gradient */}
           {canScrollRight && (
            <div className="absolute right-0 top-10 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block" />
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="hidden md:flex absolute right-0 top-[60%] -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md border border-gray-100 text-gray-600 hover:text-primary hover:scale-110 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          )}
       </div>
    </section>
  );
};
