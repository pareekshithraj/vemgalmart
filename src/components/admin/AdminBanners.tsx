import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../lib/api';
import { MultiImageUpload } from '../common/MultiImageUpload';

interface Banner {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    displayMode: string;
    order: number;
}

export function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({});

    const fetchBanners = async () => {
        try {
            const response = await api.get('/banners');
            setBanners(response.data);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleSave = async () => {
        try {
            if (currentBanner.id) {
                await api.put(`/banners/${currentBanner.id}`, currentBanner);
            } else {
                await api.post('/banners', currentBanner);
            }
            setIsEditing(false);
            setCurrentBanner({});
            fetchBanners();
        } catch (error) {
            console.error('Failed to save banner:', error);
            alert('Failed to save banner');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;
        try {
            await api.delete(`/banners/${id}`);
            fetchBanners();
        } catch (error) {
            console.error('Failed to delete banner:', error);
            alert('Failed to delete banner');
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{currentBanner.id ? 'Edit Banner' : 'New Banner'}</h2>
                    <Button variant="outline" onClick={() => setIsEditing(false)}><X className="h-4 w-4 mr-2" /> Cancel</Button>
                </div>
                <div className="space-y-4">
                    <Input
                        label="Title"
                        value={currentBanner.title || ''}
                        onChange={(e) => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full rounded-md border border-gray-300 p-2"
                            value={currentBanner.description || ''}
                            onChange={(e) => setCurrentBanner({ ...currentBanner, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                        <MultiImageUpload
                            onImagesUploaded={(urls) => setCurrentBanner({ ...currentBanner, imageUrl: urls[0] })}
                            currentImages={currentBanner.imageUrl ? [currentBanner.imageUrl] : []}
                            label="Upload Banner Image"
                            maxFiles={1}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="CTA Text"
                            value={currentBanner.ctaText || ''}
                            onChange={(e) => setCurrentBanner({ ...currentBanner, ctaText: e.target.value })}
                        />
                        <Input
                            label="CTA Link"
                            value={currentBanner.ctaLink || ''}
                            onChange={(e) => setCurrentBanner({ ...currentBanner, ctaLink: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Mode</label>
                        <select
                            className="w-full rounded-md border border-gray-300 p-2"
                            value={currentBanner.displayMode || 'default'}
                            onChange={(e) => setCurrentBanner({ ...currentBanner, displayMode: e.target.value })}
                        >
                            <option value="default">Default (Text + Overlay)</option>
                            <option value="imageOnly">Image Only</option>
                        </select>
                    </div>
                    <Button onClick={handleSave} className="w-full"><Save className="h-4 w-4 mr-2" /> Save Banner</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Banner Management</h2>
                <Button onClick={() => { setCurrentBanner({}); setIsEditing(true); }}>
                    <Plus className="h-4 w-4 mr-2" /> Add New Banner
                </Button>
            </div>

            <div className="grid gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                        <div className="h-48 w-full md:w-64 flex-shrink-0">
                            <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{banner.title}</h3>
                                <p className="text-gray-500 mt-1 lines-clamp-2">{banner.description}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                        Mode: {banner.displayMode}
                                    </span>
                                    {banner.ctaText && (
                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                            CTA: {banner.ctaText}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button size="sm" variant="outline" onClick={() => { setCurrentBanner(banner); setIsEditing(true); }}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(banner.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && !isLoading && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No banners found. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
