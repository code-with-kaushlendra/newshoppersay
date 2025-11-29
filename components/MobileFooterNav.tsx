
import React from 'react';
import { HomeIcon, BrowseIcon, PlusCircleIcon, ShoppingBagIcon, UserIcon } from './IconComponents';

interface MobileFooterNavProps {
  onHomeClick: () => void;
  onBrowseClick: () => void;
  onSellClick: () => void;
  onMyAdsClick: () => void;
  onProfileClick: () => void;
  activeView: string;
}

export const MobileFooterNav: React.FC<MobileFooterNavProps> = ({ 
  onHomeClick, 
  onBrowseClick, 
  onSellClick,
  onMyAdsClick, 
  onProfileClick,
  activeView,
}) => {
  interface NavButtonProps {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    onClick: () => void;
    isActive: boolean;
  }

  const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, onClick, isActive }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative flex flex-col items-center justify-center h-full w-full space-y-1 text-xs sm:text-sm transition-colors ${
        isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="leading-none">{label}</span>
      {isActive && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"></span>}
    </button>
  );

  return (
    <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom pb-1">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        <NavButton icon={HomeIcon} label="Home" onClick={onHomeClick} isActive={activeView === 'home'} />
        <NavButton icon={BrowseIcon} label="Categories" onClick={onBrowseClick} isActive={activeView === 'browse'} />
        <NavButton icon={PlusCircleIcon} label="Sell" onClick={onSellClick} isActive={['post', 'selectCategory', 'selectSubCategory'].includes(activeView)} />
        <NavButton icon={ShoppingBagIcon} label="My Ads" onClick={onMyAdsClick} isActive={activeView === 'businessDashboard'} />
        <NavButton icon={UserIcon} label="Profile" onClick={onProfileClick} isActive={activeView === 'profile'} />
      </div>
    </nav>
  );
};
