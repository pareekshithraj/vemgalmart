import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';

interface ImageUploadProps {
    onImageUploaded: (url: string) => void;
    currentImage?: string;
    label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImage, label = "Product Image" }) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadFile(file);
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
        const file = e.dataTransfer.files?.[0];
        if (file) {
            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            addToast('Please upload an image file', 'error');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;

            // Construct full URL including backend host
            const fullUrl = `http://localhost:5000${data.imageUrl}`;
            setPreview(fullUrl);
            onImageUploaded(fullUrl);
            addToast('Image uploaded successfully', 'success');
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            addToast((error as any).message, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageUploaded('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />

            {preview ? (
                <div className="relative rounded-2xl overflow-hidden group aspect-video bg-gray-100 border border-gray-200">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-900"
                            title="Change Image"
                        >
                            <Upload className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 bg-red-500/90 rounded-full hover:bg-red-500 transition-colors text-white"
                            title="Remove Image"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative w-full aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4
                        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}
                    `}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-sm text-gray-500 font-medium">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-gray-100'}`}>
                                <ImageIcon className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    SVG, PNG, JPG or GIF (max. 5MB)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
