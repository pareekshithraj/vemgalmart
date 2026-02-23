import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useUIStore } from '../../store/useUIStore';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils'; // Assuming this exists or will be created
import { useNavigate } from 'react-router-dom';



export function CartDrawer() {
    const { cart, removeFromCart, updateCartQuantity } = useStore();
    const { isCartOpen, closeCart } = useUIStore();
    const navigate = useNavigate();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    return (
        <>
            {/* Backdrop */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={closeCart}
                />
            )}

            {/* Drawer */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out",
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b px-6 py-4">
                        <h2 className="text-lg font-semibold">Your Cart ({cart.length})</h2>
                        <Button variant="ghost" size="icon" onClick={closeCart}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-gray-500">
                                <p className="text-lg">Your cart is empty</p>
                                <Button variant="outline" className="mt-4" onClick={closeCart}>
                                    Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100/50 p-1">
                                            <img
                                                src={item.image || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e0d9b4334%20text%20%7B%20fill%3A%2394a3b8%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e0d9b4334%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23f1f5f9%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22135.8046875%22%20y%3D%22159.2%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'}
                                                alt={item.name}
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    if (!target.src.includes('data:image')) {
                                                        target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e0d9b4334%20text%20%7B%20fill%3A%2394a3b8%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e0d9b4334%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23f1f5f9%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22135.8046875%22%20y%3D%22159.2%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                                                    }
                                                }}
                                                className="h-full w-full object-contain mix-blend-multiply"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                                            <p className="text-sm font-bold text-gray-500 mt-1">₹{item.price}</p>
                                            <div className="mt-3 flex items-center w-fit rounded-xl border border-gray-200 bg-gray-50/80 p-1 shadow-sm">
                                                <button
                                                    className="rounded-lg p-1.5 hover:bg-white hover:shadow-sm transition-all active:scale-95"
                                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3.5 w-3.5 text-gray-600" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-gray-700">{item.quantity}</span>
                                                <button
                                                    className="rounded-lg p-1.5 hover:bg-white hover:shadow-sm transition-all active:scale-95 text-primary"
                                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="bg-white/90 backdrop-blur-xl p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border-t border-gray-100/50 rounded-t-[32px] sm:rounded-none relative z-10">
                            <div className="mb-5 flex flex-col gap-1">
                                <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="flex items-center justify-between text-xl font-extrabold text-gray-900 border-t border-gray-100/50 pt-2 mt-2">
                                    <span>Total to Pay</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>
                            <Button
                                className="w-full rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary-dark transition-all duration-300 active:scale-95 h-14 text-lg font-bold"
                                size="lg"
                                onClick={handleCheckout}
                            >
                                Checkout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
