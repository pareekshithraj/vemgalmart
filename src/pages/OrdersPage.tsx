import { MainLayout } from '../components/layout/MainLayout';
import { Package, Truck, CheckCircle, Clock, ChevronRight, AlertCircle, ChevronDown, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { OrderTrackingMap } from '../components/orders/OrderTrackingMap';
import { generateInvoice } from '../utils/generateInvoice';

interface OrderItem {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
        name: string;
        image: string;
    };
}

interface Order {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    deliveryAddress: string;
    proofOfDeliveryImage?: string;
    items: OrderItem[];
}

export function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/my-orders');
                setOrders(response.data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
                setError('Failed to load orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'DELIVERED': return 'text-green-600 bg-green-50 border-green-100';
            case 'PREPARING': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case 'DELIVERED': return <CheckCircle className="h-5 w-5" />;
            case 'PREPARING': return <Package className="h-5 w-5" />;
            case 'OUT_FOR_DELIVERY': return <Truck className="h-5 w-5" />;
            case 'CANCELLED': return <AlertCircle className="h-5 w-5" />;
            default: return <Clock className="h-5 w-5" />;
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </MainLayout>
        );
    }

    if (orders.length === 0 && !error) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <Package className="h-20 w-20 text-gray-200 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
                    <Link to="/">
                        <Button>Start Shopping</Button>
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                            {order.status === 'PREPARING' && (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                </span>
                                            )}
                                            {order.status}
                                        </div>
                                        <button
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onClick={(e) => { e.stopPropagation(); generateInvoice({ ...order, total: order.totalAmount } as any); }}
                                            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-indigo-800 transition-colors bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"
                                            title="Download PDF Invoice"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Invoice
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 pl-16">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{item.quantity}x {item.product.name}</span>
                                            <span className="font-medium text-gray-900">₹{item.priceAtPurchase * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div
                                className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                            >
                                <span className="text-sm text-gray-500 max-w-[70%] truncate">
                                    Delivery: <b>{order.deliveryAddress}</b>
                                </span>
                                <button className="text-primary font-semibold text-sm flex items-center">
                                    {expandedOrderId === order.id ? 'Hide Tracking' : 'View Tracking'}
                                    {expandedOrderId === order.id ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                                </button>
                            </div>

                            {/* Expanded Tracking Section */}
                            {expandedOrderId === order.id && (
                                <div className="p-6 border-t border-gray-100 bg-white">
                                    {order.status === 'OUT_FOR_DELIVERY' || order.status === 'PICKED_UP' ? (
                                        <OrderTrackingMap orderId={order.id} deliveryAddress={order.deliveryAddress} />
                                    ) : order.status === 'DELIVERED' && order.proofOfDeliveryImage ? (
                                        <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100 flex flex-col items-center">
                                            <div className="p-3 bg-green-100 text-green-600 rounded-full mb-4">
                                                <CheckCircle className="h-8 w-8" />
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-1">Delivered Successfully</h4>
                                            <p className="text-gray-600 mb-6 font-medium">Here is your proof of delivery:</p>
                                            <div className="rounded-xl overflow-hidden border-4 border-white shadow-lg w-full max-w-sm">
                                                <img
                                                    src={order.proofOfDeliveryImage}
                                                    alt="Proof of Delivery"
                                                    className="w-full h-auto object-cover"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50/50 rounded-2xl p-6 text-center">
                                            <Truck className="h-8 w-8 text-blue-400 mx-auto mb-3 opacity-50" />
                                            <p className="text-gray-600 font-medium">Live Tracking is unavailable right now.</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {order.status === 'DELIVERED'
                                                    ? 'This order has been successfully delivered.'
                                                    : 'The map will automatically appear here once your order is Out For Delivery.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
