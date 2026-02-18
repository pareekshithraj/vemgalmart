import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Users, ShoppingBag, DollarSign, Package, TrendingUp } from 'lucide-react';

interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    activeSellers: number;
}

export const AdminOverview = () => {
    const { token } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (isLoading) {
        return <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
            </div>
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {formatCurrency(stats?.totalRevenue || 0)}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Orders</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {stats?.totalOrders || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {stats?.totalUsers || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Products</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {stats?.totalProducts || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <Package className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions or Charts could go here */}
            <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
                    <p className="opacity-90">You have {stats?.activeSellers || 0} active sellers on the platform today.</p>
                </div>
                <TrendingUp className="absolute right-0 bottom-0 h-48 w-48 opacity-10 transform translate-x-12 translate-y-12" />
            </div>
        </div>
    );
};
