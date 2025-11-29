
import React, { useState, useEffect, useRef } from 'react';
import type { User, Category } from '../types';
import { MenuIcon, UserIcon, ShoppingBagIcon, HeartIcon, CogIcon, LogoutIcon, PlusCircleIcon } from './IconComponents';

interface HeaderProps {
  user: User | null;
  onSearchChange: (query: string, category: string) => void;
  onPostProductClick: () => void;
  onHomeClick: () => void;
  onProfileClick: () => void;
  onOrdersClick: () => void;
  onWishlistClick: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
  categories: Category[];
}

const DropdownLink = React.forwardRef<HTMLAnchorElement, {
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    icon: React.ReactNode;
    label: string;
    onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
}>(({ onClick, icon, label, onKeyDown }, ref) => (
    <a
        href="#"
        role="menuitem"
        onClick={onClick}
        onKeyDown={onKeyDown}
        ref={ref}
        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:bg-gray-50 focus:outline-none"
    >
        <span className="text-gray-500 mr-3">{icon}</span>
        <span className="font-medium">{label}</span>
    </a>
));
DropdownLink.displayName = 'DropdownLink';

export const Header: React.FC<HeaderProps> = ({ user, onSearchChange, onPostProductClick, onHomeClick, onOrdersClick, onWishlistClick, onLogout, onLoginClick, categories }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down and past initial threshold
        setIsVisible(false);
        setIsDropdownOpen(false); // Close dropdown if header hides
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
      if (!isDropdownOpen) {
          menuItemsRef.current = [];
      }
  }, [isDropdownOpen]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchQuery, searchCategory);
  };

  const handleToggleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          setIsDropdownOpen((prev) => {
              if (!prev) {
                  setTimeout(() => {
                      menuItemsRef.current[0]?.focus();
                  }, 0);
              }
              return !prev;
          });
      }
  };

  const handleMenuItemKeyDown = (e: React.KeyboardEvent, index: number) => {
      const items = menuItemsRef.current.filter((item): item is HTMLAnchorElement => item !== null);
      const currentIndex = items.indexOf(menuItemsRef.current[index] as HTMLAnchorElement);

      if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex]?.focus();
      } else if (e.key === 'Escape') {
          e.preventDefault();
          closeDropdown();
      } else if (e.key === 'Tab') {
          setIsDropdownOpen(false);
      } else if (e.key === 'Home') {
          e.preventDefault();
          items[0]?.focus();
      } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1]?.focus();
      }
  };

  const closeDropdown = () => {
      setIsDropdownOpen(false);
      toggleButtonRef.current?.focus();
  };

  const SearchForm = ({ className, idPrefix, showCategory = true }: { className?: string, idPrefix: string, showCategory?: boolean }) => (
     <form onSubmit={handleSearchSubmit} className={`flex items-center w-full ${className}`}>
        <div className="flex w-full rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-primary/50 transition-all shadow-sm h-10 border border-gray-300">
            {showCategory && (
                <div className="relative flex-shrink-0 bg-gray-100 hover:bg-gray-200 transition-colors border-r border-gray-300 group hidden sm:block">
                   <select
                      aria-label="Select category for search"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="h-full py-0 pl-3 pr-7 bg-transparent text-gray-600 text-xs sm:text-sm focus:outline-none cursor-pointer appearance-none max-w-[140px] truncate font-medium z-10 relative"
                    >
                      <option value="all">All</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                </div>
            )}
            <input
              type="text"
              id={`${idPrefix}-search-items`}
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 py-2 px-4 text-sm text-gray-900 placeholder-gray-500 bg-white focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 px-3 sm:px-5 flex items-center justify-center transition-colors"
            >
               <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
        </div>
     </form>
  );

  return (
    <header 
      className={`bg-white sticky top-0 z-50 shadow-md transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        {/* Top Row: Logo, Search (Desktop), Nav */}
        <div className="flex items-center justify-between gap-2 lg:gap-4 h-16">
          
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
             <button 
                className="text-gray-700 md:hidden focus:outline-none p-1 hover:bg-gray-100 rounded-sm transition-colors" 
                aria-label="Open menu"
                onClick={() => { /* Open mobile drawer logic if implemented */ }}
             >
                <MenuIcon className="w-7 h-7" />
             </button>
             
             <div 
              onClick={onHomeClick}
              className="flex items-center cursor-pointer group py-1 px-1 hover:ring-1 hover:ring-gray-300 rounded-sm"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onHomeClick(); }}
            >
              <img 
                src="https://i.postimg.cc/rsXc55Cb/Whats-App-Image-2025-11-18-at-5-22-39-PM-removebg-preview.png" 
                alt="ShoppersSay" 
                className="h-14 w-auto object-contain" 
              />
            </div>
          </div>
          
          {/* Desktop Search (Hidden on Mobile) */}
          <div className="flex-1 max-w-3xl hidden md:block px-2">
             <SearchForm idPrefix="desktop" className="w-full" />
          </div>

          {/* Right Nav */}
          <nav className="flex items-center gap-0.5 lg:gap-1 text-gray-700">
             
            {/* SELL BUTTON */}
            <button 
                onClick={onPostProductClick}
                className="hidden sm:flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 px-3 py-1.5 rounded-md font-bold text-sm transition-all mr-1 shadow-sm whitespace-nowrap"
            >
                <PlusCircleIcon className="w-5 h-5" />
                <span>Sell</span>
            </button>

            {/* Wishlist */}
            <button 
                onClick={onWishlistClick}
                className="p-2 rounded-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex flex-col items-center justify-center min-w-[40px] sm:min-w-[50px]"
                aria-label="Wishlist"
            >
                 <div className="relative">
                    <HeartIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                 </div>
                 <span className="hidden lg:block text-[11px] font-medium mt-0.5 leading-none">Wishlist</span>
            </button>

             {/* Orders Link (Desktop only) */}
             {user && user.accountType !== 'business' && (
                <button 
                    onClick={onOrdersClick}
                    className="hidden lg:flex p-2 rounded-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex flex-col items-start justify-center leading-tight min-w-[60px]"
                >
                    <span className="text-[11px] text-gray-500">Returns</span>
                    <span className="text-sm font-bold text-gray-900">& Orders</span>
                </button>
             )}

            {/* Account Menu */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                    ref={toggleButtonRef}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    onKeyDown={handleToggleKeyDown}
                    className="focus:outline-none text-left flex items-center gap-1 p-2 rounded-sm hover:bg-gray-100 transition-colors ring-offset-2 focus:ring-2 focus:ring-primary"
                >
                    <div className="hidden lg:block text-right leading-tight mr-1 max-w-[100px]">
                        <span className="block text-[11px] text-gray-500 truncate">Hello, {user.name.split(' ')[0]}</span>
                        <span className="block text-sm font-bold text-gray-900">Account</span>
                    </div>
                    <div className="relative">
                        {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-gray-300 object-cover" />
                        ) : (
                            <UserIcon className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                </button>
                {isDropdownOpen && (
                  <div 
                    id="user-menu"
                    className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-xl py-1 z-30 border border-gray-200 focus:outline-none transform origin-top-right transition-all" 
                    role="menu" 
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-md">
                         <p className="text-xs text-gray-500">Signed in as</p>
                         <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    </div>

                    {user.accountType === 'business' ? (
                        <DropdownLink 
                            ref={(el) => { menuItemsRef.current[0] = el; }}
                            onClick={(e) => { e.preventDefault(); onPostProductClick(); closeDropdown(); }} 
                            onKeyDown={(e) => handleMenuItemKeyDown(e, 0)}
                            icon={<CogIcon className="w-5 h-5" />} 
                            label="Business Dashboard" 
                        />
                    ) : (
                         <DropdownLink 
                            ref={(el) => { menuItemsRef.current[0] = el; }}
                            onClick={(e) => { e.preventDefault(); onOrdersClick(); closeDropdown(); }} 
                            onKeyDown={(e) => handleMenuItemKeyDown(e, 0)}
                            icon={<ShoppingBagIcon className="w-5 h-5" />} 
                            label="Your Orders" 
                        />
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <DropdownLink 
                        ref={(el) => { menuItemsRef.current[1] = el; }}
                        onClick={(e) => { e.preventDefault(); onLogout(); closeDropdown(); }} 
                        onKeyDown={(e) => handleMenuItemKeyDown(e, 1)}
                        icon={<LogoutIcon className="w-5 h-5" />} 
                        label="Log Out" 
                    />
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="flex items-center p-2 rounded-sm hover:bg-gray-100 transition-colors leading-tight ml-1"
              >
                <div className="flex flex-col items-start justify-center">
                    <span className="text-[11px] text-gray-500">Hello, Sign in</span>
                    <span className="text-sm font-bold text-gray-900">Account & Lists</span>
                </div>
              </button>
            )}
          </nav>
        </div>

        {/* Mobile Search Bar (Visible on small screens) */}
        <div className="md:hidden pb-3">
             <SearchForm idPrefix="mobile" className="w-full" showCategory={false} />
        </div>
      </div>
    </header>
  );
};
