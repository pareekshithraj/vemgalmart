import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';

interface MultiImageUploadProps {
    onImagesUploaded: (urls: string[]) => void;
    currentImages?: string[];
    label?: string;
    maxFiles?: number;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    onImagesUploaded,
    currentImages = [],
    label = "Product Images",
    maxFiles = 5
}) => {
    const [previews, setPreviews] = useState<string[]>(currentImages);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            await uploadFiles(files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await uploadFiles(files);
        }
    };

    const uploadFiles = async (files: File[]) => {
        const validFiles = files.filter(file => {
            const isImage = file.type.startsWith('image/');
            const isUnderLimit = file.size <= 50 * 1024 * 1024; // 50MB

            if (!isImage) addToast(`Skipped ${file.name}: Not an image`, 'error');
            if (!isUnderLimit) addToast(`Skipped ${file.name}: File too large (max 50MB)`, 'error');

            return isImage && isUnderLimit;
        });

        if (validFiles.length === 0) {
            return;
        }

        if (previews.length + validFiles.length > maxFiles) {
            addToast(`Maximum ${maxFiles} images allowed`, 'error');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        validFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newUrls = response.data.imageUrls.map((url: string) => `http://localhost:5000${url}`);
            const updatedPreviews = [...previews, ...newUrls];

            setPreviews(updatedPreviews);
            onImagesUploaded(updatedPreviews);
            addToast('Images uploaded successfully', 'success');
        } catch (error: any) {
            addToast(error.message || 'Upload failed', 'error');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = (indexToRemove: number) => {
        const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
        setPreviews(updatedPreviews);
        onImagesUploaded(updatedPreviews);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-gray-400 text-xs">({previews.length}/{maxFiles})</span>
            </label>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                multiple
                className="hidden"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {previews.map((url, index) => (
                    <div key={index} className="relative rounded-xl overflow-hidden group aspect-square bg-gray-100 border border-gray-200">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500/90 rounded-full hover:bg-red-500 transition-colors text-white opacity-0 group-hover:opacity-100"
                            title="Remove Image"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {previews.length < maxFiles && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            relative aspect-square rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2
                            ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}
                            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        ) : (
                            <>
                                <div className={`p-3 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-gray-100'}`}>
                                    <Upload className={`w-5 h-5 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                                </div>
                                <span className="text-xs font-medium text-gray-500">Upload</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
