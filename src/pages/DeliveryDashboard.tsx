import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../context/ToastContext';
import { MainLayout } from '../components/layout/MainLayout';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MapPin, Package, Truck } from 'lucide-react';

import { useAuthStore } from '../store/useAuthStore';

export function DeliveryDashboard() {
    const { orders, assignDeliveryMan, updateOrderStatus, setOrders } = useStore();
    const { user } = useAuthStore();
    const socket = useSocket();
    const { addToast } = useToast();
    const token = localStorage.getItem('token');

    const fetchOrders = async () => {
        try {
            // Fetch relevant orders for delivery (all ready for pickup + my active ones)
            // For now fetching all orders might be simplest if the backend filters or if we filter client side
            // Ideally we need an endpoint for delivery dashboard
            const response = await fetch('http://localhost:5000/api/orders/my-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    useEffect(() => {
        fetchOrders();

        if (socket) {
            socket.on('new_order', () => {
                fetchOrders();
            });

            socket.on('order_status_updated', (data: any) => {
                if (data.status === 'ready_for_pickup') {
                    addToast('New order ready for pickup!', 'success');
                }
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

    // Available orders: status is 'ready_for_pickup' and no delivery man assigned
    const availableOrders = orders.filter(o => o.status === 'ready_for_pickup' && !o.deliveryManId);

    // My active deliveries: assigned to current user and not delivered
    const myDeliveries = orders.filter(o => o.deliveryManId === user?.id && o.status !== 'delivered');

    const handleAcceptOrder = (orderId: string) => {
        if (user) {
            assignDeliveryMan(orderId, user.id);
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Delivery Dashboard</h1>
                        <p className="mt-2 text-lg text-gray-600">You are the city's lifeline, <span className="font-semibold text-primary">{user?.name}</span>.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Available Orders */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Package className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Available for Pickup</h2>
                        </div>

                        {availableOrders.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-gray-300 p-12 text-center">
                                <p className="text-gray-500 text-lg">No orders ready for pickup right now.</p>
                                <p className="text-sm text-gray-400 mt-1">Check back in a moment!</p>
                            </div>
                        ) : (
                            availableOrders.map(order => (
                                <div key={order.id} className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                        <Package className="h-24 w-24 text-primary" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="mb-4 flex justify-between items-start">
                                            <div>
                                                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600 mb-2">Order #{order.id}</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-gray-900">₹{order.total + 50}</span>
                                                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-2">Earn ₹50</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-6 space-y-3">
                                            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                                                <MapPin className="mt-1 h-5 w-5 text-red-500 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">drop location</p>
                                                    <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                                                </div>
                                            </div>
                                            <p className="pl-4 text-sm text-gray-500 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                Contains {order.items.length} items
                                            </p>
                                        </div>

                                        <Button
                                            className="w-full rounded-xl py-6 text-base shadow-lg shadow-indigo-500/20"
                                            onClick={() => handleAcceptOrder(order.id)}
                                        >
                                            Accept Delivery
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* My Active Deliveries */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <Truck className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">My Active Deliveries</h2>
                        </div>

                        {myDeliveries.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-gray-300 p-12 text-center bg-gray-50/50">
                                <p className="text-gray-500 text-lg">No active deliveries.</p>
                                <p className="text-sm text-gray-400 mt-1">Accept an order to get started!</p>
                            </div>
                        ) : (
                            myDeliveries.map(order => (
                                <div key={order.id} className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-xl shadow-blue-500/5">
                                    <div className="mb-6 flex justify-between items-center">
                                        <span className="font-bold text-gray-900">Order #{order.id}</span>
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 uppercase tracking-wide text-xs px-3 py-1">
                                            {order.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    <div className="mb-6 space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-lg">📍</div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deliver To</p>
                                                <p className="font-semibold text-gray-900 text-lg">{order.deliveryAddress}</p>
                                                <p className="text-sm text-gray-500">{order.customerName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Logic for status updates */}
                                        {order.status === 'ready_for_pickup' || order.status === 'preparing' ? (
                                            <Button
                                                className="w-full rounded-xl py-6 text-base font-semibold"
                                                onClick={() => updateOrderStatus(order.id, 'picked_up')}
                                            >
                                                Confirm Pickup
                                            </Button>
                                        ) : order.status === 'picked_up' ? (
                                            <Button
                                                className="w-full bg-green-600 hover:bg-green-700 rounded-xl py-6 text-base font-semibold shadow-lg shadow-green-500/20"
                                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                            >
                                                Mark Delivered
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
