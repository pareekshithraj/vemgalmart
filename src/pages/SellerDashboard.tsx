import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../context/ToastContext';
import { MainLayout } from '../components/layout/MainLayout';
import { AddProductForm } from '../components/seller/AddProductForm';
import { SellerAnalytics } from '../components/seller/SellerAnalytics';
import { Badge } from '../components/ui/Badge';
import { CheckCircle, LayoutDashboard, Package, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../lib/api';

import { useAuthStore } from '../store/useAuthStore';

export function SellerDashboard() {
    const { products, orders, updateOrderStatus, setOrders } = useStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
    const socket = useSocket();
    const { addToast } = useToast();

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/my-orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    useEffect(() => {
        fetchOrders();

        if (socket) {
            socket.on('new_order', (order: any) => {
                addToast(`New order received! #${order.id}`, 'success');
                fetchOrders();
            });

            socket.on('order_status_updated', () => {
                fetchOrders();
            });
        }

        return () => {
            if (socket) {
                socket.off('new_order');
                socket.off('order_status_updated');
            }
        };
    }, [socket, addToast]);

    // Filter products by current seller
    const myProducts = products.filter(p => p.sellerId === user?.id);

    // Filter pending orders
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Seller Dashboard</h1>
                        <p className="mt-2 text-lg text-gray-600">Manage your business, <span className="font-semibold text-primary">{user?.name}</span>.</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                        {[
                            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                            { id: 'products', label: 'Products', icon: Package },
                            { id: 'orders', label: 'Orders', icon: ShoppingBag },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        <SellerAnalytics />
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 animate-fade-in">
                        <div className="lg:col-span-12">
                            <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-xl shadow-gray-200/50 mb-8">
                                <h2 className="mb-6 text-2xl font-bold text-gray-900">Add New Product</h2>
                                <AddProductForm />
                            </div>
                            <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-xl shadow-gray-200/50">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">My Inventory ({myProducts.length})</h2>
                                </div>

                                {myProducts.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">You haven't added any products yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {myProducts.map(product => (
                                            <div key={product.id} className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200">
                                                <div className="flex gap-4 mb-4">
                                                    <div className="h-20 w-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                                                        <p className="text-sm font-medium text-primary mt-1">₹{product.price}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-[10px] items-center px-1.5 py-0.5 rounded-md font-medium border ${product.stock && product.stock > 0
                                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                                : 'bg-red-50 text-red-700 border-red-100'
                                                                }`}>
                                                                {product.stock && product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 py-2 text-xs border-gray-200"
                                                        onClick={() => addToast('Edit functionality coming soon!', 'info')}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="flex-1 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={async () => {
                                                            if (confirm('Are you sure you want to delete this product?')) {
                                                                try {
                                                                    const { deleteProduct } = useStore.getState();
                                                                    await deleteProduct(product.id);
                                                                    addToast('Product deleted successfully', 'success');
                                                                } catch (err) {
                                                                    addToast('Failed to delete product', 'error');
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="animate-fade-in">
                        <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-xl shadow-gray-200/50">
                            <div className="mb-8 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Incoming Orders</h2>
                                <Badge variant="warning" className="rounded-full px-3">{pendingOrders.length} Pending</Badge>
                            </div>

                            {pendingOrders.length === 0 ? (
                                <div className="py-20 text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                                        <CheckCircle className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">All caught up!</h3>
                                    <p className="text-gray-500">No new orders at the moment.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingOrders.map(order => (
                                        <div key={order.id} className="rounded-3xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200">
                                            <div className="mb-4 flex items-center justify-between">
                                                <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">#{order.id}</span>
                                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 uppercase tracking-wider">
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="mb-6">
                                                <p className="text-sm text-gray-500 mb-2">Customer: <span className="font-semibold text-gray-900">{order.customerName}</span></p>
                                                <div className="space-y-2">
                                                    {order.items.map(item => (
                                                        <div key={item.id} className="flex justify-between text-sm">
                                                            <span className="text-gray-600">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-200/50 flex justify-between items-center text-sm font-semibold">
                                                    <span>Total Earnings</span>
                                                    <span className="text-green-600 text-base">₹{order.total}</span>
                                                </div>
                                            </div>
                                            <Button
                                                className="w-full gap-2 rounded-xl py-3 shadow-lg shadow-primary/20"
                                                onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                                Mark Ready
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout >
    );
}
