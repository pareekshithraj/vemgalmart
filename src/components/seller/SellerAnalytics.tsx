import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../lib/api';

export function SellerAnalytics() {
    const [isLoading, setIsLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState<any>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics/seller');
                setAnalyticsData(response.data);
            } catch (error) {
                console.error("Failed to fetch seller analytics", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!analyticsData) return null;

    const { metrics, salesData, topProducts } = analyticsData;

    const stats = [
        { label: 'Total Revenue', value: `₹${metrics.totalRevenue.toLocaleString()}`, change: '+0%', trend: 'up', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active Orders', value: metrics.activeOrders.toString(), change: '+0', trend: 'up', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Customers', value: metrics.totalCustomers.toString(), change: '+0%', trend: 'up', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Avg. Order Value', value: `₹${Math.round(metrics.avgOrderValue).toLocaleString()}`, change: '-0%', trend: 'down', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    // Chart Data
    const weeklySales = salesData.map((d: any) => d.revenue);
    const maxSale = Math.max(...weeklySales, 100); // minimum 100 to avoid div by 0

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {stat.change}
                                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart (Mock Visual) */}
                <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Weekly Revenue</h3>
                        <select className="bg-gray-50 border-none text-sm font-semibold rounded-lg px-3 py-1 text-gray-600">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {salesData.map((data: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-primary/10 rounded-t-xl relative group-hover:bg-primary/20 transition-colors"
                                    style={{ height: `${(data.revenue / maxSale) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ₹{data.revenue.toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400">
                                    {data.name.charAt(0)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Products */}
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Top Products</h3>
                    <div className="space-y-4">
                        {topProducts.length === 0 ? (
                            <p className="text-sm text-gray-500">No product sales yet.</p>
                        ) : (
                            topProducts.map((product: any) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h4>
                                        <p className="text-xs text-gray-500">{product.totalSales} sales</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-gray-900 text-sm block">₹{product.price}</span>
                                        <span className="text-xs text-green-600 font-semibold text-right">₹{product.revenue} made</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors">
                        View All Products
                    </button>
                </div>
            </div>
        </div>
    );
}
