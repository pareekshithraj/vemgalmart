import type { Product } from '../../types';
import { useStore } from '../../store/useStore';
import { Plus, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e0d9b4334%20text%20%7B%20fill%3A%2394a3b8%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A20pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e0d9b4334%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23f1f5f9%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22135.8046875%22%20y%3D%22159.2%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const { addToCart, wishlist, toggleWishlist } = useStore();
    const { user } = useAuthStore();
    const isOutOfStock = product.stock === 0;
    const isWishlisted = wishlist.some(p => p.id === product.id);
    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_IMAGE);

    useEffect(() => {
        setImgSrc(product.image || FALLBACK_IMAGE);
    }, [product.image]);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/10 border border-gray-100 hover:border-primary/20 cursor-pointer h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50 p-2 sm:p-4 flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-500">
                <img
                    src={imgSrc}
                    alt={product.name}
                    onError={() => {
                        // Prevent infinite loop if fallback also fails
                        if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
                    }}
                    className={`h-full w-full object-contain mix-blend-multiply rounded-2xl transition-all duration-700 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5">
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

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) addToCart(product);
                    }}
                    disabled={isOutOfStock}
                    className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2.5 py-1 sm:px-3 sm:py-1.5 flex items-center justify-center gap-1 rounded-xl shadow-md transition-all duration-300 active:scale-95 border ${isOutOfStock
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white/95 backdrop-blur-md text-primary font-extrabold border-gray-100/80 hover:bg-primary hover:text-white hover:border-primary hover:shadow-primary/25'
                        }`}
                >
                    <span className="text-[11px] sm:text-xs tracking-wide">ADD</span>
                    <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
                </button>
                {/* Wishlist Button */}
                {user && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                        }}
                        className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 active:scale-95 border border-white/40 ${isWishlisted
                            ? 'bg-white text-red-500'
                            : 'bg-white/70 text-gray-400 hover:text-red-500 hover:bg-white'
                            }`}
                    >
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={isWishlisted ? "currentColor" : "none"} strokeWidth={isWishlisted ? 2.5 : 2} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-2.5 sm:p-4 mt-1">
                <div className="mb-1.5 flex flex-nowrap items-center gap-1.5 opacity-100 lg:opacity-80 group-hover:opacity-100 transition-opacity w-full overflow-hidden">
                    <p className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-wider truncate flex-shrink min-w-0">{product.category}</p>
                    {product.brand && (
                        <>
                            <span className="h-1 w-1 rounded-full bg-gray-300 shrink-0" />
                            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider uppercase truncate flex-shrink min-w-0">{product.brand}</p>
                        </>
                    )}
                </div>

                <h3 className="mb-2 text-[13px] sm:text-[15px] font-bold text-gray-900 line-clamp-2 min-h-[2rem] leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                <div className="mt-auto flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                    <span className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[11px] sm:text-xs text-gray-400 line-through font-semibold decoration-gray-300 decoration-2">₹{product.originalPrice}</span>
                    )}
                </div>

                {product.seller && (
                    <div className="mt-3 flex items-center justify-between border-t border-gray-100/50 pt-2.5 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-[10px] font-medium text-gray-400 p-0 sm:uppercase tracking-wide shrink-0 mr-2">Sold by</span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 truncate min-w-0 flex-1 text-right">{product.seller.shopName || product.seller.name}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
