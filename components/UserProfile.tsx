import React, { useState } from 'react';
import type { User, PurchaseRecord, Review, Product } from '../types';
import { StarRating } from './StarRating';
import { PurchaseHistoryItem } from './PurchaseHistoryItem';
import { StarIcon } from './IconComponents';

interface UserProfileProps {
  currentUser: User;
  profileUser: User;
  purchases: PurchaseRecord[];
  allUsers: User[];
  allReviews: Review[];
  onLeaveReview: (purchase: PurchaseRecord) => void;
  onOpenReturnModal: (purchase: PurchaseRecord) => void;
  onCancelOrder: (purchase: PurchaseRecord) => void;
  onDeletePurchase: (purchaseId: number) => void;
  onToggleFavoriteSeller: (sellerId: number) => void;
  onViewProfile: (user: User) => void;
  userProducts: Product[];
  onViewDetails: (product: Product) => void;
}

type ProfileTab = 'listings' | 'reviews' | 'purchases' | 'favorites';

const StatusPill: React.FC<{ status: Product['status'] }> = ({ status }) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending_payment: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-gray-200 text-gray-700',
      sold: 'bg-purple-100 text-purple-800',
    };
    const text = {
      active: 'Active',
      pending_payment: 'Pending Payment',
      expired: 'Expired',
      sold: 'Sold',
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
        {text[status]}
      </span>
    );
};

const ProfileStat: React.FC<{ icon: React.ReactNode, label: string, value: number | string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 text-primary mb-2">
            {icon}
        </div>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
    </div>
);

const TabButton: React.FC<{ label: string, isActive: boolean, onClick: () => void, count: number }> = ({ label, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
            isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`}
    >
        {label} <span className="text-xs bg-gray-200 rounded-full px-1.5 py-0.5 ml-1">{count}</span>
    </button>
);


export const UserProfile: React.FC<UserProfileProps> = ({ 
    currentUser, 
    profileUser, 
    purchases, 
    allUsers, 
    allReviews, 
    onLeaveReview, 
    onOpenReturnModal, 
    onCancelOrder, 
    onToggleFavoriteSeller, 
    onViewProfile, 
    userProducts,
    onViewDetails
}) => {
    const isOwnProfile = currentUser.id === profileUser.id;
    const isFavorited = currentUser.favoriteSellers?.includes(profileUser.id);
    const favoriteSellersDetails = allUsers.filter(u => currentUser.favoriteSellers?.includes(u.id));
    const sellerReviews = allReviews.filter(review => review.sellerId === profileUser.id);
    
    const [activeTab, setActiveTab] = useState<ProfileTab>('listings');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'listings':
                return userProducts.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {userProducts.map(product => (
                            <li key={product.id} className="p-4 sm:p-6 hover:bg-gray-50 flex flex-col sm:flex-row items-center gap-4 cursor-pointer" onClick={() => onViewDetails(product)}>
                                <div className="flex items-center space-x-4 flex-grow w-full">
                                    <img src={product.imageUrls[0]} alt={product.title} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg text-gray-800 hover:text-primary transition-colors">{product.title}</h3>
                                            <StatusPill status={product.status} />
                                        </div>
                                        <p className="text-primary font-bold">₹{product.price.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">
                                            Posted: {product.postedDate}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 p-8 text-center">This user has no active listings.</p>
                );
            case 'reviews':
                return sellerReviews.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {sellerReviews.map(review => (
                            <div key={review.id} className="p-6">
                                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
                                    <p className="font-semibold text-gray-800">{review.reviewerName}</p>
                                    <div className="flex items-center space-x-2">
                                        <StarRating rating={review.rating} />
                                        <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">For item: <span className="font-medium text-gray-600">"{review.listingTitle}"</span></p>
                                {review.text && (
                                    <p className="mt-4 text-gray-700 leading-relaxed italic bg-gray-50 p-4 rounded-md border">
                                        "{review.text}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 p-8 text-center">This seller doesn't have any reviews yet.</p>
                );
            case 'purchases':
                return purchases.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {purchases.map((purchase) => (
                            <div className="px-6" key={purchase.id}>
                               {/* Fix: Removed onDeletePurchase as it's not a valid prop for PurchaseHistoryItem */}
                               <PurchaseHistoryItem purchase={purchase} onLeaveReview={onLeaveReview} onOpenReturnModal={onOpenReturnModal} onCancelOrder={onCancelOrder} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 p-8 text-center">No purchase history found.</p>
                );
            case 'favorites':
                return favoriteSellersDetails.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {favoriteSellersDetails.map(seller => (
                            <div key={seller.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4 cursor-pointer flex-grow" onClick={() => onViewProfile(seller)}>
                                    <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{seller.name}</h3>
                                        {seller.rating && (
                                            <div className="flex items-center mt-1">
                                                <StarRating rating={seller.rating.average} size="sm" />
                                                <span className="text-xs text-gray-500 ml-1.5">({seller.rating.count})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleFavoriteSeller(seller.id); }}
                                    className="bg-red-100 text-red-700 px-3 py-1 text-sm rounded-md hover:bg-red-200 font-semibold"
                                >
                                    Unfavorite
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                     <p className="text-gray-500 p-8 text-center">You haven't favorited any sellers yet.</p>
                );
            default: return null;
        }
    }


  return (
    <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
                        {!isOwnProfile && (
                            <button 
                                onClick={() => onToggleFavoriteSeller(profileUser.id)}
                                className={`absolute top-4 right-4 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors z-10 ${
                                    isFavorited
                                    ? 'bg-orange-100 text-primary'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {isFavorited ? '✓ Favorited' : '+ Favorite Seller'}
                            </button>
                        )}
                        <div className="bg-gradient-to-br from-orange-50 via-white to-white p-8 pb-16 text-center">
                            <img src={profileUser.avatar} alt={profileUser.name} className="w-32 h-32 rounded-full mx-auto ring-4 ring-white shadow-md" />
                            <h1 className="text-3xl font-bold text-gray-900 mt-6">{profileUser.name}</h1>
                            <p className="text-gray-500 mt-2">Member since July 2024</p>
                        </div>
                        <div className="bg-gray-50/50 grid grid-cols-1 p-4 -mt-8 mx-4 rounded-lg shadow-sm backdrop-blur-sm">
                           <ProfileStat icon={<StarIcon className="w-5 h-5"/>} label="Seller Rating" value={profileUser.rating?.average.toFixed(1) || 'N/A'} />
                        </div>
                    </div>
                </aside>

                 {/* Right Column */}
                <main className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px px-4" aria-label="Tabs">
                           <TabButton label="Listings" isActive={activeTab === 'listings'} onClick={() => setActiveTab('listings')} count={userProducts.length} />
                            {!isOwnProfile && (
                                <TabButton label="Reviews" isActive={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} count={sellerReviews.length} />
                            )}
                            {isOwnProfile && (
                                <>
                                    <TabButton label="My Orders" isActive={activeTab === 'purchases'} onClick={() => setActiveTab('purchases')} count={purchases.length} />
                                    <TabButton label="Favorite Sellers" isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} count={favoriteSellersDetails.length} />
                                </>
                            )}
                        </nav>
                    </div>
                    <div className="min-h-[400px]">
                        {renderTabContent()}
                    </div>
                </main>

            </div>
        </div>
    </div>
  );
};
