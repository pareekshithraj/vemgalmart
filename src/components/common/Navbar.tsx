import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { ShoppingCart, Store, User, Search, ShoppingBag, MapPin, HelpCircle, LogOut, Truck, Sparkles, Loader2, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '../../lib/api';

export function Navbar() {
    const { cart, searchQuery, setSearchQuery, reset, setProducts } = useStore();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { toggleCart } = useUIStore();
    const navigate = useNavigate();
    const location = useLocation();

    const [isSmartSearch, setIsSmartSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const handleLogout = () => {
        logout();
        reset(); // Clear cart and orders
        navigate('/login');
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sticky top-4 z-50 w-full px-4 md:px-6 mb-2 sm:mb-6"
        >
            <nav className="container mx-auto flex h-16 items-center justify-between px-6 bg-white/70 backdrop-blur-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl transition-all">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary-dark text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110 shrink-0">
                            <Store className="h-6 w-6" />
                        </div>
                        <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">Vemgal Mart</span>
                    </Link>


                    {(user?.role === 'seller' || user?.role === 'delivery_man' || user?.role === 'ADMIN') && (
                        <Link
                            to={user.role === 'seller' ? '/seller' : user.role === 'delivery_man' ? '/delivery' : '/admin'}
                            className="hidden md:block ml-8 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">

                    {user?.role === 'buyer' && (
                        <>
                            {/* Search Bar */}
                            <div className="hidden md:flex relative group ml-4 mr-2 items-center">
                                <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className={`block w-72 rounded-xl border-2 bg-gray-50 py-2 pl-10 pr-12 text-sm placeholder-gray-500 focus:bg-white focus:outline-none transition-all ${isSmartSearch
                                        ? 'border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10'
                                        : 'border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10'
                                        }`}
                                    placeholder={isSmartSearch ? "Ask AI anything (e.g. 'spicy dinner')" : "Search products..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter' && isSmartSearch && searchQuery.trim()) {
                                            setIsSearching(true);
                                            try {
                                                const res = await api.get(`/search/smart?q=${encodeURIComponent(searchQuery)}`);
                                                // Overwrite store products with AI recommendations, ideally you'd have a separate results page
                                                // for true scalability, but for MVP we override the home feed.
                                                if (location.pathname !== '/') navigate('/');
                                                setProducts(res.data.products);
                                            } catch (err) {
                                                console.error(err);
                                            } finally {
                                                setIsSearching(false);
                                            }
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => setIsSmartSearch(!isSmartSearch)}
                                    className={`absolute right-2 p-1.5 rounded-lg transition-colors ${isSmartSearch ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-200'
                                        }`}
                                    title="Toggle AI Smart Search"
                                >
                                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                </button>
                            </div>

                            <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 text-gray-600 hover:text-primary inline-flex shrink-0" onClick={toggleCart}>
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-scale-in items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md shadow-red-500/20">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </>
                    )}

                    {/* Profile Dropdown or Login Button */}
                    {isAuthenticated && user ? (
                        <div className="relative group/profile block">
                            <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-2 md:px-4 md:py-1.5 shadow-sm hover:shadow-md transition-shadow">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="hidden md:block text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user.name}</span>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 translate-y-2 group-hover/profile:translate-y-0 z-50">
                                <div className="w-56 rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden p-2">
                                    <div className="px-3 py-2 border-b border-gray-50 mb-1">
                                        <p className="text-xs text-gray-500">Signed in as</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                    </div>
                                    {user.role === 'ADMIN' && (
                                        <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                            <User className="h-4 w-4" /> Admin Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'seller' && (
                                        <Link to="/seller" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                            <Store className="h-4 w-4" /> Seller Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'delivery_man' && (
                                        <Link to="/delivery" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                            <Truck className="h-4 w-4" /> Delivery Dashboard
                                        </Link>
                                    )}
                                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                        <User className="h-4 w-4" /> Profile
                                    </Link>
                                    <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                        <ShoppingBag className="h-4 w-4" /> My Orders
                                    </Link>
                                    <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                        <Heart className="h-4 w-4" /> My Wishlist
                                    </Link>
                                    <Link to="/addresses" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                        <MapPin className="h-4 w-4" /> Saved Addresses
                                    </Link>
                                    <Link to="/support" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                        <HelpCircle className="h-4 w-4" /> Customer Support
                                    </Link>
                                    <div className="h-px bg-gray-50 my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <LogOut className="h-4 w-4" /> Log Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm" className="bg-primary hover:bg-primary-dark text-white">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </motion.div>
    );
}
