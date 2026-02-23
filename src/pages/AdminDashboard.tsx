import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    LogOut,
    Menu,
    ShieldCheck,
    Store,
    Truck,
    ShoppingBag,
    List,
    Image,
    Ticket
} from 'lucide-react';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminApprovals } from '../components/admin/AdminApprovals';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminBanners } from '../components/admin/AdminBanners';
import { AdminCoupons } from '../components/admin/AdminCoupons';

export const AdminDashboard = () => {
    const { user, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'approvals' | 'categories' | 'banners' | 'coupons'>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Redirect if not admin
    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    const navigation = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'users', name: 'User Management', icon: Users },
        { id: 'categories', name: 'Categories', icon: List },
        { id: 'banners', name: 'Banners', icon: Image },
        { id: 'coupons', name: 'Coupons (Promos)', icon: Ticket },
        { id: 'approvals', name: 'Pending Approvals', icon: CheckSquare },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <AdminOverview />;
            case 'users': return <AdminUsers />;
            case 'categories': return <AdminCategories />;
            case 'banners': return <AdminBanners />;
            case 'coupons': return <AdminCoupons />;
            case 'approvals': return <AdminApprovals />;
            default: return <AdminOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
                </div>

                <div className="p-4">
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id as 'overview' | 'users' | 'approvals' | 'categories' | 'banners');
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                        ${activeTab === item.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                    `}
                                >
                                    <Icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-primary' : 'text-gray-400'}`} />
                                    {item.name}
                                </button>
                            );
                        })}

                        <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                            <a href="/seller" className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors rounded-lg">
                                <Store className="mr-3 h-5 w-5 text-gray-400" />
                                Seller View
                            </a>
                            <a href="/delivery" className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors rounded-lg">
                                <Truck className="mr-3 h-5 w-5 text-gray-400" />
                                Delivery View
                            </a>
                            <a href="/" className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors rounded-lg">
                                <ShoppingBag className="mr-3 h-5 w-5 text-gray-400" />
                                Switch to Buying
                            </a>
                        </div>
                    </nav>
                </div>

                <div className="p-4 absolute bottom-0 w-full border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="font-semibold text-gray-600">{user.name.charAt(0)}</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="font-semibold text-gray-900">Admin Panel</span>
                    <div className="w-8" /> {/* Spacer for centering */}
                </div>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {navigation.find(n => n.id === activeTab)?.name}
                            </h1>
                        </div>
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};
