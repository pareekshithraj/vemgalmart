import { MainLayout } from '../components/layout/MainLayout';
import { useStore } from '../store/useStore';
import { User, MapPin, LogOut, ChevronRight, ShoppingBag, Heart, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function ProfilePage() {
    const { user } = useStore();

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-primary-dark p-1">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                        <p className="text-gray-500 mb-4">+91 98765 43210 • {user?.role}</p>
                        <Button variant="outline" size="sm" className="rounded-full">Edit Profile</Button>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    <div className="divide-y divide-gray-50">
                        {[
                            { icon: ShoppingBag, label: 'My Orders', color: 'text-blue-500', bg: 'bg-blue-50' },
                            { icon: Heart, label: 'Wishlist', color: 'text-red-500', bg: 'bg-red-50' },
                            { icon: MapPin, label: 'Saved Addresses', color: 'text-orange-500', bg: 'bg-orange-50' },
                            { icon: Settings, label: 'Settings', color: 'text-gray-500', bg: 'bg-gray-50' },
                        ].map((item, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer group transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-semibold text-gray-900">{item.label}</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <Button variant="ghost" className="w-full py-4 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl font-semibold">
                    <LogOut className="h-5 w-5 mr-2" />
                    Log Out
                </Button>
            </div>
        </MainLayout>
    );
}
