import { Star } from 'lucide-react';

interface FilterSidebarProps {
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    minRating: number;
    setMinRating: (rating: number) => void;
    sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'newest';
    setSortBy: (sort: 'recommended' | 'price_asc' | 'price_desc' | 'newest') => void;
}

import { motion, AnimatePresence } from 'framer-motion';

export const FilterSidebar = ({
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    sortBy,
    setSortBy
}: FilterSidebarProps) => {
    return (
        <div className="bg-white/60 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-6 space-y-8 sticky top-24">
            <div>
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Sort By</h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all hover:bg-white cursor-pointer"
                >
                    <option value="recommended">Recommended</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>

            <div className="pt-6 border-t border-gray-200/50">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Price Range</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
                            <input
                                type="number"
                                min="0"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
                            <input
                                type="number"
                                min={priceRange[0]}
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-200/50">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Minimum Rating</h3>
                <div className="space-y-3">
                    {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={minRating === rating}
                                    onChange={() => setMinRating(rating)}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary transition-colors"></div>
                                <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="flex items-center gap-1 group-hover:opacity-80 transition-opacity">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                                    />
                                ))}
                                <span className="text-sm font-medium text-gray-600 ml-1">& Up</span>
                            </div>
                        </label>
                    ))}
                    <label className="flex items-center gap-3 cursor-pointer group pt-1">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name="rating"
                                checked={minRating === 0}
                                onChange={() => setMinRating(0)}
                                className="peer sr-only"
                            />
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary transition-colors"></div>
                            <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Any Rating</span>
                    </label>
                </div>
            </div>

            <AnimatePresence>
                {(minRating > 0 || priceRange[0] > 0 || priceRange[1] < 50000 || sortBy !== 'recommended') && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 border-t border-gray-200/50 overflow-hidden"
                    >
                        <button
                            onClick={() => {
                                setMinRating(0);
                                setPriceRange([0, 50000]);
                                setSortBy('recommended');
                            }}
                            className="w-full bg-gray-900 text-white hover:bg-gray-800 text-sm font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                        >
                            Reset Filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
