
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { Home } from './Home';
import { ListingDetail } from './ListingDetail';
import { Dashboard } from './Dashboard';
import { OrdersPage } from './OrdersPage';
import { LoginPage } from './LoginPage';
import { WishlistPage } from './WishlistPage';
import { Footer } from './Footer';
import { SpinnerIcon } from './IconComponents';
import { CATEGORIES } from '../constants';
import { api } from '../services/api';
import type { Product, User, PurchaseRecord, Category, Review } from '../types';

// Modals
import { PaymentModal } from './PaymentModal';
import { RatingModal } from './RatingModal';
import { ReturnModal } from './ReturnModal';
import { CancelOrderModal } from './CancelOrderModal';
import { AdminDashboard } from './AdminDashboard';
import { UserEditModal } from './UserEditModal';

// New Page Imports
import { MobileFooterNav } from './MobileFooterNav';
import { BrowsePage } from './BrowsePage';
import { UserProfile } from './UserProfile';
import { PostAdForm } from './PostAdForm';

type View = 'home' | 'details' | 'post' | 'businessDashboard' | 'adminDashboard' | 'orders' | 'wishlist' | 'browse' | 'profile';
type ActiveModal = 
    | { type: 'rate'; data: PurchaseRecord }
    | { type: 'return'; data: PurchaseRecord }
    | { type: 'cancel'; data: PurchaseRecord }
    | { type: 'editUser'; data: User }
    | { type: 'payment'; data: Product };


const getInitialUser = (): User | null => {
    try {
        const item = localStorage.getItem('shopperssay-currentUser');
        return item ? JSON.parse(item) : null;
    } catch { return null; }
};

const App: React.FC = () => {
    // --- Data State ---
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(getInitialUser());
    const [wishlist, setWishlist] = useState<string[]>([]);

    // --- UI State ---
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<View>('home');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);
    const [selectedUserProfile, setSelectedUserProfile] = useState<User | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                setIsLoading(true);
                try {
                    const data = await api.fetchData(currentUser.id);
                    setUsers(data.users);
                    setProducts(data.products);
                    setPurchases(data.purchases);
                    setReviews(data.reviews);
                    setWishlist(data.wishlist);
                    const freshCurrentUser = data.users.find(u => u.id === currentUser.id);
                    if (freshCurrentUser) {
                        setCurrentUser(freshCurrentUser);
                        localStorage.setItem('shopperssay-currentUser', JSON.stringify(freshCurrentUser));
                    }
                } catch (error) { console.error("Failed to fetch data:", error); } 
                finally { setIsLoading(false); }
            } else {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentUser?.id]);
    
    // --- Auth Handlers ---
    const handleLogin = async (details: { email: string; name: string; phone: string; address: string; accountType: 'user' | 'business' }) => {
        try {
            const user = await api.login(details);
            setCurrentUser(user);
            localStorage.setItem('shopperssay-currentUser', JSON.stringify(user));
            if (user.isAdmin) {
                setView('adminDashboard');
            } else if (user.accountType === 'business') {
                setView('businessDashboard');
            } else {
                setView('home');
            }
        } catch (error) {
            alert("Login failed. Please check your details and try again.");
            console.error(error);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('shopperssay-currentUser');
        setView('home'); 
    };

    // --- Filtering Logic ---
    const filterProducts = useCallback(() => {
        let result = products.filter(l => l.status === 'active');
        if (searchQuery) {
            result = result.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCategory) {
            result = result.filter(product => product.category === selectedCategory);
        }
        setFilteredProducts(result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    }, [products, searchQuery, selectedCategory]);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, selectedCategory, products, filterProducts]);

    const handleSearch = (query: string, category: string) => {
        setSearchQuery(query);
        setSelectedCategory(category === 'all' ? null : category);
        setView('home');
    }

    // --- Navigation and View Handlers ---
    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
        setView('details');
    };

    const handleBack = () => {
        setView('home');
        setSelectedProduct(null);
    };

    // --- Buy Now and Payment Handlers ---
    const handleBuyNow = (product: Product) => {
        if (!currentUser) {
            alert("Please log in to make a purchase.");
            return;
        }
        setActiveModal({ type: 'payment', data: product });
    };

    const handlePaymentSuccess = (purchase: PurchaseRecord) => {
        setPurchases(prev => [purchase, ...prev]);
        // Since the product is now sold, update its status in the main product list
        setProducts(prevProducts => prevProducts.map(p => 
            p.id === purchase.product.id ? { ...p, status: 'sold' } : p
        ));
        setActiveModal(null);
        alert('Purchase successful! Your order has been placed.');
        setView('orders');
    };

    // --- CRUD and Action Handlers ---
    const handleSaveProduct = async (productData: Omit<Product, 'id' | 'postedDate' | 'seller' | 'status' | 'expiryDate'> & { id?: string }) => {
        if (!currentUser) return false;
        try {
            const savedProduct = await api.saveProduct(productData, currentUser);
            setProducts(prev => {
                const existing = prev.find(p => p.id === savedProduct.id);
                return existing ? prev.map(p => p.id === savedProduct.id ? savedProduct : p) : [savedProduct, ...prev];
            });
            return true;
        } catch (error: any) { 
            console.error("Save failed", error);
            let msg = error?.message || JSON.stringify(error);
            
            // Specific check for the missing column error
            if (msg.includes("posted_date") || msg.includes("column") || msg.includes("schema cache")) {
                msg = "Database Error: Missing columns (like 'posted_date').\n\nPlease run the SQL script provided in the instructions to update your Supabase table structure.";
            } else if (msg.includes("imageUrl") && msg.includes("not-null")) {
                msg = "Database Error: The database expects an 'imageUrl' column which is missing data. We've updated the app to send this data. Please try again.";
            }
            
            alert(`Save Product Error:\n${msg}`); 
            return false;
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        // UI components (MyListings, AdminPosts) now handle the confirmation modal.
        // This function strictly performs the deletion.
        try {
            await api.deleteProduct(productId);
            setProducts(prev => prev.filter(l => l.id !== productId));
        } catch (error) { alert("There was an error deleting this product."); }
    };
    
    const handleToggleWishlist = async (productId: string) => {
        if (!currentUser) return;
        const newWishlist = await api.toggleWishlist(currentUser.id, productId);
        setWishlist(newWishlist);
    };

    const handleToggleFavoriteSeller = async (sellerId: number) => {
        if (!currentUser) return;
        const favorites = currentUser.favoriteSellers || [];
        const newFavorites = favorites.includes(sellerId)
            ? favorites.filter(id => id !== sellerId)
            : [...favorites, sellerId];
        
        const updatedUser = { ...currentUser, favoriteSellers: newFavorites };
        try {
             await api.updateUser(updatedUser);
             setCurrentUser(updatedUser);
             setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        } catch (e) {
            console.error("Failed to toggle favorite seller", e);
        }
    };

    const handleViewProfile = (user: User) => {
        setSelectedUserProfile(user);
        setView('profile');
    }

    // --- Admin Handlers ---
    const handleDeleteUser = async (userId: number) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await api.deleteUser(userId);
                setUsers(prev => prev.filter(u => u.id !== userId));
            } catch (error) { alert("Failed to delete user."); }
        }
    };

    const handleSaveUser = async (user: User) => {
        try {
            const updatedUser = await api.updateUser(user);
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            setActiveModal(null);
        } catch (error) { alert("Failed to update user."); }
    };
    
    // --- Modal Handlers ---
    const handleSubmitReview = async (purchase: PurchaseRecord, rating: number, text: string) => {
        try {
            const newReview = await api.submitReview(purchase, rating, text);
            setReviews(prev => [...prev, newReview]);
            setPurchases(prev => prev.map(p => p.id === purchase.id ? {...p, reviewSubmitted: true } : p));
            setActiveModal(null);
        } catch (error) { alert("Failed to submit review."); }
    };
    
    const handleSubmitReturn = async (purchase: PurchaseRecord, reason: string) => {
        try {
            const updatedPurchase = await api.updatePurchaseStatus(purchase.id, 'returned', reason);
            setPurchases(prev => prev.map(p => p.id === updatedPurchase.id ? updatedPurchase : p));
            setActiveModal(null);
        } catch (error) { alert("Failed to submit return request."); }
    };

    const handleSubmitCancellation = async (purchase: PurchaseRecord, reason: string) => {
         try {
            const updatedPurchase = await api.updatePurchaseStatus(purchase.id, 'cancelled', reason);
            setPurchases(prev => prev.map(p => p.id === updatedPurchase.id ? updatedPurchase : p));
            setActiveModal(null);
        } catch (error) { alert("Failed to cancel order."); }
    };
    
    // --- Render Logic ---
    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <SpinnerIcon className="w-16 h-16 text-primary" />
            </div>
        );
    }

    const renderContent = () => {
        // Force admin view if user is admin
        if (currentUser.isAdmin && view !== 'details') {
            return <AdminDashboard 
                allUsers={users}
                allProducts={products}
                onDeleteUser={handleDeleteUser}
                onEditUser={(user) => setActiveModal({type: 'editUser', data: user})}
                onDeleteProduct={handleDeleteProduct}
                onEditProduct={handleViewDetails}
            />;
        }

        switch (view) {
            case 'details':
                return selectedProduct && <ListingDetail
                    product={selectedProduct} 
                    onBack={handleBack} 
                    onBuyNow={handleBuyNow}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                />;
            case 'businessDashboard':
                const userProducts = products.filter(l => l.seller.id === currentUser.id);
                return <Dashboard 
                    userProducts={userProducts} 
                    onDeleteProduct={handleDeleteProduct} 
                    onSaveProduct={handleSaveProduct}
                    currentUser={currentUser}
                    categories={CATEGORIES}
                />;
            case 'post':
                 return <PostAdForm 
                    categories={CATEGORIES}
                    currentUser={currentUser}
                    onSaveProduct={async (data) => { 
                        const success = await handleSaveProduct(data); 
                        if (success) setView('businessDashboard'); 
                        return success;
                    }}
                    onCancel={() => setView('home')}
                 />;
            case 'browse':
                return <BrowsePage
                    categories={CATEGORIES}
                    products={products}
                    onViewDetails={handleViewDetails}
                    onBuyNow={handleBuyNow}
                    currentUser={currentUser}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                />;
            case 'profile':
                const profileUser = selectedUserProfile || currentUser;
                const userListings = products.filter(p => p.seller.id === profileUser.id);
                return <UserProfile
                    currentUser={currentUser}
                    profileUser={profileUser}
                    purchases={purchases.filter(p => p.buyer_id === currentUser.id)}
                    allUsers={users}
                    allReviews={reviews}
                    onLeaveReview={(p) => setActiveModal({type: 'rate', data: p})}
                    onOpenReturnModal={(p) => setActiveModal({type: 'return', data: p})}
                    onCancelOrder={(p) => setActiveModal({type: 'cancel', data: p})}
                    onDeletePurchase={() => {}}
                    onToggleFavoriteSeller={handleToggleFavoriteSeller}
                    onViewProfile={handleViewProfile}
                    userProducts={userListings}
                    onViewDetails={handleViewDetails}
                />;
            case 'wishlist':
                const wishlistItems = products.filter(l => wishlist.includes(l.id));
                return <WishlistPage 
                    wishlistItems={wishlistItems} 
                    onViewDetails={handleViewDetails}
                    onRemoveFromWishlist={handleToggleWishlist}
                />
            case 'orders':
                return <OrdersPage 
                    purchases={purchases.filter(p => p.buyer_id === currentUser.id)} 
                    onLeaveReview={(p) => setActiveModal({type: 'rate', data: p})}
                    onOpenReturnModal={(p) => setActiveModal({type: 'return', data: p})}
                    onCancelOrder={(p) => setActiveModal({type: 'cancel', data: p})}
                />;
            case 'home':
            default:
                return <Home
                    products={filteredProducts}
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onViewDetails={handleViewDetails}
                    onBuyNow={handleBuyNow}
                    currentUser={currentUser}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                />;
        }
    };

    const renderModal = () => {
        if (!activeModal) return null;
        switch (activeModal.type) {
            case 'payment':
                return <PaymentModal product={activeModal.data} currentUser={currentUser} onClose={() => setActiveModal(null)} onPaymentSuccess={handlePaymentSuccess} />;
            case 'rate':
                return <RatingModal purchase={activeModal.data} onClose={() => setActiveModal(null)} onSubmit={handleSubmitReview} />;
            case 'return':
                return <ReturnModal purchase={activeModal.data} onClose={() => setActiveModal(null)} onSubmit={handleSubmitReturn} />;
            case 'cancel':
                return <CancelOrderModal purchase={activeModal.data} onClose={() => setActiveModal(null)} onSubmit={handleSubmitCancellation} />;
            case 'editUser':
                 return <UserEditModal user={activeModal.data} onClose={() => setActiveModal(null)} onSave={handleSaveUser} showAdminControls={currentUser.isAdmin} />;
            default:
                return null;
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header
                user={currentUser}
                onSearchChange={handleSearch}
                onPostProductClick={() => setView('post')}
                onHomeClick={() => setView(currentUser.isAdmin ? 'adminDashboard' : 'home')}
                onProfileClick={() => { setSelectedUserProfile(currentUser); setView('profile'); }}
                onOrdersClick={() => setView('orders')}
                onWishlistClick={() => setView('wishlist')}
                onLogout={handleLogout}
                onLoginClick={() => {}}
                categories={CATEGORIES}
            />
            <main id="main-content" className="flex-grow pb-16 md:pb-0">
                {renderContent()}
            </main>
            
            {currentUser && !currentUser.isAdmin && (
                 <MobileFooterNav 
                    onHomeClick={() => setView('home')}
                    onBrowseClick={() => setView('browse')}
                    onSellClick={() => setView('post')}
                    onMyAdsClick={() => setView('businessDashboard')}
                    onProfileClick={() => { setSelectedUserProfile(currentUser); setView('profile'); }}
                    activeView={view}
                 />
            )}

            <Footer 
                onContactClick={() => {}}
                onHomeClick={() => setView('home')}
            />
            {renderModal()}
        </div>
    );
};

export default App;
