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
                                        <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">₹{item.price}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <button
                                                    className="rounded-md border p-1 hover:bg-gray-100"
                                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    className="rounded-md border p-1 hover:bg-gray-100"
                                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
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
                        <div className="border-t bg-gray-50 p-6">
                            <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <Button className="w-full" size="lg" onClick={handleCheckout}>
                                Checkout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
