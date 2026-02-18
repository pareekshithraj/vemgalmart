import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { AddressFormModal } from '../components/address/AddressFormModal';
import api from '../lib/api';

const steps = [
    { id: 1, label: 'Address', icon: MapPin },
    { id: 2, label: 'Payment', icon: CreditCard },
    { id: 3, label: 'Review', icon: ShoppingBag },
];

export function CheckoutPage() {
    const { cart, user, placeOrder, clearCart } = useStore();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const fetchAddresses = async () => {
        setIsLoadingAddresses(true);
        try {
            const response = await api.get('/user/address');
            const data = response.data;
            setAddresses(data);
            // Select default address if available, else first one
            const defaultAddr = data.find((a: any) => a.isDefault);
            if (defaultAddr && !selectedAddressId) setSelectedAddressId(defaultAddr.id);
            else if (data.length > 0 && !selectedAddressId) setSelectedAddressId(data[0].id);
        } catch (error) {
            console.error('Failed to fetch addresses', error);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    useEffect(() => {
        if (currentStep === 1) {
            fetchAddresses();
        }
    }, [currentStep]);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal + 40 + 5; // Delivery + Platform fee

    const handlePlaceOrder = async () => {
        if (!user) return;
        if (!selectedAddressId) {
            addToast('Please select a delivery address', 'error');
            return;
        }

        setIsPlacingOrder(true);

        try {
            // Send items directly to backend as per new plan
            const response = await api.post('/orders', {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                deliveryAddress: addresses.find(a => a.id === selectedAddressId)?.id
                    ? `${addresses.find(a => a.id === selectedAddressId)?.street}, ${addresses.find(a => a.id === selectedAddressId)?.village}, ${addresses.find(a => a.id === selectedAddressId)?.city} - ${addresses.find(a => a.id === selectedAddressId)?.pincode}`
                    : 'Unknown Address'
            });

            if (response.status === 201) {
                // Update local store (legacy) - optional if we move to full backend sync
                const newOrder = {
                    id: response.data.order.id,
                    items: [...cart],
                    total,
                    status: 'pending' as const,
                    customerName: user.name,
                    deliveryAddress: response.data.order.deliveryAddress,
                    createdAt: new Date().toISOString(),
                };
                placeOrder(newOrder);

                clearCart();
                addToast('Order placed successfully! 🎉', 'success');
                navigate('/orders');
            }
        } catch (error) {
            console.error(error);
            addToast('Failed to place order', 'error');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (cart.length === 0) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <ShoppingBag className="h-20 w-20 text-gray-200 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <Link to="/">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                {/* Steps */}
                <div className="mb-12">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full" />
                        <div
                            className="absolute left-0 top-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                        />
                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-gray-50 p-2 rounded-xl">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= step.id
                                    ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/25'
                                    : 'bg-white border-gray-200 text-gray-400'
                                    }`}>
                                    <step.icon className="h-5 w-5" />
                                </div>
                                <span className={`text-sm font-semibold ${currentStep >= step.id ? 'text-primary' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Step 1: Address */}
                        {currentStep === 1 && (
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Select Delivery Address</h2>
                                <div className="space-y-4">
                                    {isLoadingAddresses ? (
                                        <div className="text-center py-4">Loading addresses...</div>
                                    ) : addresses.length === 0 ? (
                                        <div className="text-center py-6 text-gray-500">
                                            No addresses found. Please add a new address.
                                        </div>
                                    ) : (
                                        addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${selectedAddressId === addr.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className={`h-5 w-5 rounded-full border-2 mt-1 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-primary' : 'border-gray-300'
                                                    }`}>
                                                    {selectedAddressId === addr.id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-gray-900 capitalize">{addr.type}</span>
                                                        {addr.isDefault && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Default</span>}
                                                    </div>
                                                    <p className="text-gray-600 text-sm">
                                                        {addr.street}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        {addr.village}, {addr.city} - {addr.pincode}
                                                    </p>
                                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                        <p>Ph: {addr.phone}</p>
                                                        {addr.alternatePhone && <p>Alt: {addr.alternatePhone}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => setIsAddressModalOpen(true)}>
                                        + Add New Address
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {currentStep === 2 && (
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
                                <div className="space-y-4">
                                    {[
                                        { id: 'upi', label: 'UPI (GPay / PhonePe)', icon: '📱' },
                                        { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                                        { id: 'cod', label: 'Cash on Delivery', icon: '💵' }
                                    ].map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => setSelectedPayment(method.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedPayment === method.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-primary' : 'border-gray-300'
                                                }`}>
                                                {selectedPayment === method.id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                            </div>
                                            <span className="text-2xl">{method.icon}</span>
                                            <span className="font-bold text-gray-900">{method.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {currentStep === 3 && (
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Review Order</h2>
                                <div className="space-y-4 mb-6">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 space-y-2">
                                    <p><span className="font-semibold">Deliver to:</span> {addresses.find(a => a.id === selectedAddressId)?.type || 'Selected Address'}</p>
                                    <p><span className="font-semibold">Address:</span> {addresses.find(a => a.id === selectedAddressId)?.village}, {addresses.find(a => a.id === selectedAddressId)?.city}</p>
                                    <p><span className="font-semibold">Payment:</span> {selectedPayment.toUpperCase()}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            {currentStep > 1 && (
                                <Button variant="outline" onClick={() => setCurrentStep(c => c - 1)} className="flex-1">
                                    Back
                                </Button>
                            )}
                            <Button
                                className="flex-1 shadow-lg shadow-primary/25"
                                onClick={() => currentStep === 3 ? handlePlaceOrder() : setCurrentStep(c => c + 1)}
                                disabled={isPlacingOrder}
                            >
                                {isPlacingOrder ? 'Placing Order...' : currentStep === 3 ? 'Place Order' : 'Continue'}
                                {currentStep !== 3 && <ArrowRight className="ml-2 h-5 w-5" />}
                            </Button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600">₹40</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Platform Fee</span>
                                    <span>₹5</span>
                                </div>
                                <div className="h-px bg-gray-100" />
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddressFormModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSuccess={() => {
                    fetchAddresses();
                    setIsAddressModalOpen(false);
                }}
            />
        </MainLayout>
    );
}
