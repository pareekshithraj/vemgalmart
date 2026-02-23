import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Plus, Home, Briefcase, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { AddressFormModal } from '../components/address/AddressFormModal';
import { useToast } from '../context/ToastContext';

interface Address {
    id: string;
    type: string;
    isDefault: boolean;
    street: string;
    village: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    alternatePhone?: string;
}

export function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const { user } = useStore();
    const { addToast } = useToast();

    // We need token from somewhere. Assuming it's in localStorage for now
    const token = localStorage.getItem('token');

    const fetchAddresses = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/address', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setAddresses(data);
            }
        } catch (error) {
            console.error('Failed to fetch addresses', error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/user/address/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                addToast('Address deleted successfully', 'success');
                fetchAddresses();
            } else {
                throw new Error('Failed to delete');
            }
        } catch {
            addToast('Failed to delete address', 'error');
        }
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
                    <Button
                        onClick={handleAddNew}
                        className="shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add New Address
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No addresses saved</h3>
                        <p className="text-gray-500 mt-1">Add your home or work address for faster checkout.</p>
                        <Button variant="outline" className="mt-4" onClick={handleAddNew}>
                            Add Address
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((addr) => (
                            <div key={addr.id} className={`relative p-6 rounded-3xl border transition-all ${addr.isDefault ? 'bg-white border-primary ring-1 ring-primary/20 shadow-md' : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'}`}>
                                {addr.isDefault && (
                                    <span className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                                        DEFAULT
                                    </span>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${addr.type === 'Home' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {addr.type === 'Home' ? <Home className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                                    </div>
                                    <h3 className="font-bold text-gray-900">{addr.type}</h3>
                                </div>

                                <div className="space-y-1 mb-6 text-gray-600">
                                    {/* User name comes from user store, or potentially address if we added it. 
                                        For now using user's name or a fallback if not available on address object */}
                                    <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                                    <p>{addr.street}</p>
                                    <p>{addr.village}, {addr.city}</p>
                                    <p>{addr.state} - {addr.pincode}</p>

                                    <div className="pt-2 text-sm text-gray-500">
                                        <p className="flex items-center gap-1">
                                            <span className="font-medium text-gray-700">Phone:</span> {addr.phone}
                                        </p>
                                        {addr.alternatePhone && (
                                            <p className="flex items-center gap-1">
                                                <span className="font-medium text-gray-700">Alt:</span> {addr.alternatePhone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => handleEdit(addr)}
                                        className="flex-1 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="h-4 w-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="flex-1 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <AddressFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchAddresses}
                    initialData={editingAddress}
                />
            </div>
        </MainLayout>
    );
}
