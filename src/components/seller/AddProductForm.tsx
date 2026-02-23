import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus } from 'lucide-react';
import { MultiImageUpload } from '../common/MultiImageUpload';
import { useCategories } from '../../hooks/useCategories';

import { useAuthStore } from '../../store/useAuthStore';

export function AddProductForm() {
    const addProduct = useStore((state) => state.addProduct);
    const user = useAuthStore((state) => state.user);
    const { categories } = useCategories();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        stock: '',
        category: '',
        brand: '',
        description: '',
        images: [] as string[],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            addToast('You must be logged in to add a product', 'error');
            return;
        }

        if (formData.images.length === 0) {
            addToast('Please upload at least one image', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await addProduct({
                name: formData.name,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                stock: formData.stock ? Number(formData.stock) : 0,
                category: formData.category,
                description: formData.description,
                image: formData.images[0], // Backend handles this, but sending just in case
                images: formData.images,
                brand: formData.brand,
                sellerId: user.id,
            });

            setFormData({
                name: '',
                price: '',
                originalPrice: '',
                stock: '',
                category: '',
                brand: '',
                description: '',
                images: []
            });
            addToast('Product added successfully!', 'success');
        } catch {
            addToast('Failed to add product. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                    label="Product Name"
                    placeholder="e.g. Alphonso Mangoes"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Price (₹)"
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                        required
                    />
                    <Input
                        label="Original Price (₹)"
                        type="number"
                        placeholder="Optional"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                        required
                    >
                        <option value="">Select a Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Stock Quantity"
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                        required
                    />
                    <Input
                        label="Brand (Optional)"
                        placeholder="e.g. Local Farm"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                </div>
            </div>

            <div>
                <MultiImageUpload
                    onImagesUploaded={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
                    currentImages={formData.images}
                    label="Product Images"
                    maxFiles={5}
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">Processing...</span>
                ) : (
                    <>
                        <Plus className="mr-2 h-5 w-5" />
                        Add Product to Inventory
                    </>
                )}
            </Button>
        </form>
    );
}
