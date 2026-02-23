
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus, Heart } from 'lucide-react';
import api from '../lib/api';
import type { Product } from '../types';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductReviews } from '../components/products/ProductReviews';
import { useAuthStore } from '../store/useAuthStore';

export function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart, products, wishlist, toggleWishlist } = useStore();
    const { user } = useAuthStore();

    const [product, setProduct] = useState<Product | null>(
        products.find(p => p.id === id) || null
    );
    const [isLoading, setIsLoading] = useState(!product);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e0d9b4334%20text%20%7B%20fill%3A%2394a3b8%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e0d9b4334%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23f1f5f9%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22135.8046875%22%20y%3D%22159.2%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (e.currentTarget.src !== FALLBACK_IMAGE) {
            e.currentTarget.src = FALLBACK_IMAGE;
            // Also update activeImage if this was the main hero image failing
            if (activeImage === e.currentTarget.src) {
                setActiveImage(FALLBACK_IMAGE);
            }
        }
    };

    const isWishlisted = product && wishlist.some(p => p.id === product.id);

    useEffect(() => {
        // If product not found in store or we want fresh data
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
                if (!activeImage) setActiveImage(response.data.image);
            } catch (error) {
                console.error('Failed to fetch product', error);
                // Optionally redirect to 404
            } finally {
                setIsLoading(false);
            }
        };

        if (!product) {
            fetchProduct();
        } else {
            setActiveImage(product.image);
        }
    }, [id, product, activeImage]);

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setQuantity(1);
        // Optional: Show toast or navigate to cart
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    if (!product) {
        return (
            <MainLayout>
                <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
                    <Button onClick={() => navigate('/')} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
                <Button
                    variant="ghost"
                    className="mb-4 md:mb-8"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center p-8 border border-gray-100">
                            <img
                                src={activeImage || product.image || FALLBACK_IMAGE}
                                alt={product.name}
                                onError={handleImageError}
                                className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
                            />
                        </div>

                        {/* Thumbnails */}
                        {/* Thumbnails */}
                        {product.images && product.images.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <img
                                            src={img || FALLBACK_IMAGE}
                                            alt={`View ${idx + 1}`}
                                            onError={handleImageError}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        ) : product.image && (
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                <button
                                    onClick={() => setActiveImage(product.image)}
                                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === product.image ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <img
                                        src={product.image || FALLBACK_IMAGE}
                                        alt="Main"
                                        onError={handleImageError}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div>
                            <p className="text-sm md:text-base font-medium text-primary mb-2">
                                {product.seller?.shopName || product.seller?.name || 'Vemgal Mart'}
                            </p>
                            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
                            <p className="text-sm md:text-base text-gray-500 mb-6">{product.category}</p>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-4xl font-bold text-gray-900">₹{product.price}</span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                                    )}
                                </div>
                                {product.stock !== undefined && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${product.stock > 0
                                        ? 'bg-green-50 text-green-700 border-green-100'
                                        : 'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                    </span>
                                )}
                            </div>

                            <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-auto pt-8 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center border-2 border-gray-200 rounded-xl w-full sm:w-auto">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-3 hover:bg-gray-50 text-gray-600 transition-colors"
                                    >
                                        <Minus className="h-5 w-5" />
                                    </button>
                                    <span className="px-4 py-3 font-bold text-gray-900 min-w-[50px] text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-3 hover:bg-gray-50 text-gray-600 transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>

                                <Button
                                    className="flex-1 py-4 text-base md:text-lg rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all h-auto"
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    {product.stock === 0 ? 'Out of Stock' : `Add to Cart - ₹${product.price * quantity}`}
                                </Button>

                                {user && (
                                    <Button
                                        variant="outline"
                                        className={`px-4 py-4 rounded-xl border-2 transition-all h-auto ${isWishlisted
                                            ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                                            : 'border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200'
                                            }`}
                                        onClick={() => toggleWishlist(product.id)}
                                    >
                                        <Heart className="h-6 w-6" fill={isWishlisted ? "currentColor" : "none"} strokeWidth={isWishlisted ? 2.5 : 2} />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <ProductReviews productId={product.id} />
            </div>
        </MainLayout>
    );
}
