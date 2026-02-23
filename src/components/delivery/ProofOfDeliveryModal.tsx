import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Save, X, Camera } from 'lucide-react';
import { MultiImageUpload } from '../common/MultiImageUpload';

interface ProofOfDeliveryModalProps {
    orderId: string;
    onClose: () => void;
    onConfirm: (imageUrl: string) => Promise<void>;
}

export function ProofOfDeliveryModal({ orderId, onClose, onConfirm }: ProofOfDeliveryModalProps) {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    // Handle body scroll locking
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            addToast('Please upload a proof of delivery photo', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await onConfirm(images[0]);
            addToast('Delivery marked as complete!', 'success');
            onClose();
        } catch {
            addToast('Failed to complete delivery. Please try again.', 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col relative animate-slide-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-primary" />
                        Proof of Delivery
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <form id="pod-form" onSubmit={handleSubmit} className="space-y-6">
                        <p className="text-sm text-gray-600">
                            Please upload a photo of the package at the delivery location or with the customer to confirm delivery for Order #{orderId.slice(0, 8)}.
                        </p>

                        <div>
                            <MultiImageUpload
                                onImagesUploaded={(urls) => setImages(urls)}
                                currentImages={images}
                                label="Take or Upload Photo"
                                maxFiles={1}
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
                        form="pod-form"
                        disabled={isLoading || images.length === 0}
                        className="rounded-xl px-6 bg-green-600 hover:bg-green-700"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">Completing...</span>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Confirm Delivery
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
