import { Home, Layers, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Link, useLocation } from 'react-router-dom';

export function BottomNav() {
    const { cart } = useStore();
    const location = useLocation();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden safe-area-bottom">
            <div className="grid h-16 grid-cols-4 items-center justify-items-center">
                {/* Home */}
                <Link to="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Home className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                {/* Categories - For now handled as a section in Home or a specific page if existed. 
                    If no categories page exists, we can scroll to categories or just remove/replace. 
                    Let's assume there isn't a dedicated page yet, so maybe point to home or a #categories anchor? 
                    Actually, let's just make it point to Home for now or check if there is a category filter. 
                    Let's stick to Home with a query param or just keep it as a placeholder/feature for now. 
                    Wait, let's make it link to / which shows categories on top.
                */}
                <Link to="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/categories') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                    <Layers className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Categories</span>
                </Link>

                {/* Cart (with Badge) */}
                <Link
                    to="/cart"
                    className={`relative flex flex-col items-center gap-1 transition-colors ${isActive('/cart') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <div className="relative">
                        <ShoppingBag className="h-6 w-6" />
                        {cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">Cart</span>
                </Link>

                {/* Profile */}
                <Link to="/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                    <User className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
}
