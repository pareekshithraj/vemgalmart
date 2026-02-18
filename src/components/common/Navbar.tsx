import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { ShoppingCart, Store, User, Search, ShoppingBag, MapPin, HelpCircle, LogOut, Truck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
    const { cart, searchQuery, setSearchQuery, reset } = useStore();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { toggleCart } = useUIStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        reset(); // Clear cart and orders
        navigate('/login');
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl transition-all">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary-dark text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                            <Store className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Vemgal Mart</span>
                    </Link>


                    {(user?.role === 'seller' || user?.role === 'delivery_man' || user?.role === 'ADMIN') && (
                        <Link
                            to={user.role === 'seller' ? '/seller' : user.role === 'delivery_man' ? '/delivery' : '/admin'}
                            className="ml-8 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">

                    {user?.role === 'buyer' && (
                        <>
                            {/* Search Bar */}
                            <div className="hidden md:flex relative group ml-4 mr-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-64 rounded-xl border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 text-gray-600 hover:text-primary hidden md:inline-flex" onClick={toggleCart}>
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
                        <div className="relative group/profile hidden md:block">
                            <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-sm hover:shadow-md transition-shadow">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user.name}</span>
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
            </div>
        </nav>
    );
}
