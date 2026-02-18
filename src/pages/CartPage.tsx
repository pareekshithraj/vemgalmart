import { useStore } from '../store/useStore';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartPage() {
    const { cart, removeFromCart, updateCartQuantity } = useStore();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = 40;
    const total = subtotal + deliveryFee;

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                            alt="Empty Cart"
                            className="w-32 h-32 mx-auto mb-6 opacity-50"
                        />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                        <Link to="/">
                            <Button size="lg">Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-1">{item.name}</h3>
                                                <p className="text-xs md:text-sm text-gray-500">{item.category}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors -mr-1 md:mr-0 p-1 md:p-0"
                                            >
                                                <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 md:mt-4">
                                            <div className="flex items-center gap-2 md:gap-3 bg-gray-50 rounded-lg p-1">
                                                <button
                                                    className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                                                    onClick={() => updateCartQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                >
                                                    <Minus className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                                                </button>
                                                <span className="text-xs md:text-sm font-semibold w-4 md:w-6 text-center">{item.quantity}</span>
                                                <button
                                                    className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                                                </button>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm md:text-base">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Fee</span>
                                        <span className="text-green-600">₹{deliveryFee}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Platform Fee</span>
                                        <span>₹5</span>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{total + 5}</span>
                                    </div>
                                </div>

                                <Link to="/checkout">
                                    <Button className="w-full py-4 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40">
                                        Proceed to Checkout
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
