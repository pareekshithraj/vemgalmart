import type { Product } from '../../types';
import { useStore } from '../../store/useStore';
import { Plus } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const addToCart = useStore((state) => state.addToCart);
    const isOutOfStock = product.stock === 0;
    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-transparent hover:border-gray-100 cursor-pointer h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {isOutOfStock ? (
                        <span className="inline-flex items-center rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white">
                            Out of Stock
                        </span>
                    ) : discount > 0 && (
                        <span className="inline-flex items-center rounded-lg bg-red-500 text-white px-2.5 py-1 text-xs font-bold shadow-sm">
                            {discount}% OFF
                        </span>
                    )}
                </div>

                {/* Add to Cart Button (Mobile/Desktop consistent) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) addToCart(product);
                    }}
                    disabled={isOutOfStock}
                    className={`absolute bottom-3 right-3 h-10 w-10 flex items-center justify-center rounded-full shadow-lg transition-transform duration-200 active:scale-90 ${isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-primary hover:bg-primary hover:text-white'
                        }`}
                >
                    <Plus className="h-6 w-6" />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-1 flex items-center gap-1.5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{product.category}</p>
                    {product.brand && (
                        <>
                            <span className="h-0.5 w-0.5 rounded-full bg-gray-300" />
                            <p className="text-xs font-medium text-gray-400">{product.brand}</p>
                        </>
                    )}
                </div>

                <h3 className="mb-2 text-base font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                <div className="mt-auto flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through font-medium">₹{product.originalPrice}</span>
                    )}
                </div>

                {product.seller && (
                    <p className="mt-2 text-[10px] text-gray-400 flex items-center gap-1 truncate">
                        By <span className="font-medium text-gray-600">{product.seller.shopName || product.seller.name}</span>
                    </p>
                )}
            </div>
        </div>
    );
}
