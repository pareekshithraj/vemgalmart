import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, X } from 'lucide-react';
import { MultiImageUpload } from '../common/MultiImageUpload';
import { useCategories } from '../../hooks/useCategories';
import type { Product } from '../../types';

interface EditProductModalProps {
    product: Product;
    onClose: () => void;
}

export function EditProductModal({ product, onClose }: EditProductModalProps) {
    const updateProduct = useStore((state) => state.updateProduct);
    const { categories } = useCategories();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: product.name || '',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        stock: product.stock?.toString() || '0',
        category: product.category || '',
        brand: product.brand || '',
        description: product.description || '',
        images: product.images || (product.image ? [product.image] : []),
    });

    // Handle body scroll locking
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            addToast('Please upload at least one image', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await updateProduct(product.id, {
                name: formData.name,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                stock: formData.stock ? Number(formData.stock) : 0,
                category: formData.category,
                description: formData.description,
                image: formData.images[0],
                images: formData.images,
                brand: formData.brand,
            });

            addToast('Product updated successfully!', 'success');
            onClose();
        } catch {
            addToast('Failed to update product. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative animate-slide-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-6">
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
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-xl px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-product-form"
                        disabled={isLoading}
                        className="rounded-xl px-6"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">Saving...</span>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
