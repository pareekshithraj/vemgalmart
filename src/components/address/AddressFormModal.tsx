import React, { useState, useEffect } from 'react';
import { X, Home, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../context/ToastContext';

interface AddressFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function AddressFormModal({ isOpen, onClose, onSuccess, initialData }: AddressFormModalProps) {
    const { addToast } = useToast();
    // const token = useStore(state => state.user?.token); // Removed as it caused type error and we use localStorage below
    const [isLoading, setIsLoading] = useState(false);

    // We need the token. If it's not in the user object in store, we might need to get it from localStorage or authStore
    // For now assuming it's in localStorage if not in store
    const authToken = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        type: 'Home',
        phone: '',
        alternatePhone: '',
        street: '',
        village: '',
        city: 'Vemgal',
        state: 'Karnataka',
        pincode: '',
        isDefault: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type || 'Home',
                phone: initialData.phone || '',
                alternatePhone: initialData.alternatePhone || '',
                street: initialData.street || '',
                village: initialData.village || '',
                city: initialData.city || 'Vemgal',
                state: initialData.state || 'Karnataka',
                pincode: initialData.pincode || '',
                isDefault: initialData.isDefault || false
            });
        } else {
            setFormData({
                type: 'Home',
                phone: '',
                alternatePhone: '',
                street: '',
                village: '',
                city: 'Vemgal',
                state: 'Karnataka',
                pincode: '',
                isDefault: false
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = initialData
                ? `http://localhost:5000/api/user/address/${initialData.id}`
                : 'http://localhost:5000/api/user/address';

            const method = initialData ? 'PUT' : 'POST';

            const payload = {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                village: formData.village,
                phone: formData.phone,
                alternatePhone: formData.alternatePhone || null,
                type: formData.type,
                isDefault: formData.isDefault
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save address');
            }

            addToast(initialData ? 'Address updated successfully' : 'Address added successfully', 'success');
            onSuccess();
            onClose();
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'Home' })}
                            className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.type === 'Home'
                                ? 'border-primary bg-primary/5 text-primary font-semibold ring-1 ring-primary/20'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Home className="w-4 h-4" /> Home
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'Work' })}
                            className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.type === 'Work'
                                ? 'border-orange-500 bg-orange-50 text-orange-600 font-semibold ring-1 ring-orange-200'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Briefcase className="w-4 h-4" /> Work
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Phone Number"
                            placeholder="+91..."
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                        <Input
                            label="Alt Phone (Optional)"
                            placeholder="+91..."
                            value={formData.alternatePhone}
                            onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Village Name"
                            placeholder="Village Name"
                            value={formData.village}
                            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                            required
                        />
                        <Input
                            label="Pincode"
                            placeholder="563102"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Street / Building / Landmark"
                        placeholder="#123, Main Road"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="City"
                            placeholder="Vemgal"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                        />
                        <Input
                            label="State"
                            placeholder="Karnataka"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isDefault"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Make this my default address
                        </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Address'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
