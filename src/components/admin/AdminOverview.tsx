import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Users, DollarSign, Package, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../lib/api';

interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalRevenue: number;
    pendingApprovals: number;
}

interface SalesData {
    name: string;
    revenue: number;
    orders: number;
}

export const AdminOverview = () => {
    const { token } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Using our new analytics endpoint
                const response = await api.get('/analytics');
                if (response.status === 200) {
                    setStats(response.data.metrics);
                    setSalesData(response.data.salesData);
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
        return <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>;
    }

    return (
        <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {formatCurrency(stats?.totalRevenue || 0)}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {stats?.totalUsers || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Products</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {stats?.totalProducts || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <Package className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {stats?.pendingApprovals || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Overview (Last 7 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value}`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number | undefined) => [formatCurrency(value || 0), 'Revenue']}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Banner / Quick Action */}
                <div className="bg-gradient-to-br from-primary to-green-800 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-3">Welcome to Admin Control</h2>
                        <p className="text-green-100 leading-relaxed mb-6">
                            Monitor your store's performance, manage users, and track revenue growth all in one place.
                        </p>
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                            <p className="text-sm text-green-50 mb-1">Today's Orders</p>
                            <p className="text-3xl font-bold">{salesData[salesData.length - 1]?.orders || 0}</p>
                        </div>
                    </div>
                    <TrendingUp className="absolute right-0 bottom-0 h-48 w-48 opacity-10 transform translate-x-8 translate-y-8" />
                </div>

            </div>
        </div>
    );
};
