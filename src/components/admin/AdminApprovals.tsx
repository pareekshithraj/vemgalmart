import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { Check, X, Loader2, User, Truck, Store } from 'lucide-react';
import api from '../../lib/api';

interface PendingUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

export const AdminApprovals = () => {
    // const { token } = useAuthStore(); // Handled by api interceptor
    const { addToast } = useToast();
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPendingUsers = async () => {
        try {
            const response = await api.get('/admin/pending-users');
            setPendingUsers(response.data);
        } catch (error) {
            console.error(error);
            addToast('Error fetching pending users', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (userId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await api.put(`/admin/users/${userId}/status`, { status });

            addToast(`User ${status.toLowerCase()} successfully`, 'success');
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            addToast('Error updating status', 'error');
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'SELLER': return <Store className="h-5 w-5 text-purple-600" />;
            case 'DELIVERY_PARTNER': return <Truck className="h-5 w-5 text-blue-600" />;
            default: return <User className="h-5 w-5 text-gray-600" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (pendingUsers.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                <p className="mt-1 text-gray-500">No pending approvals at the moment.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            </div>
            <ul className="divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                    <li key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                {getRoleIcon(user.role)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                    {user.role.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleStatusUpdate(user.id, 'APPROVED')}
                                className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                                title="Approve"
                            >
                                <Check className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(user.id, 'REJECTED')}
                                className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                                title="Reject"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
