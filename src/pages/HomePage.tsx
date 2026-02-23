import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProductCard } from '../components/common/ProductCard';
import { MainLayout } from '../components/layout/MainLayout';
import { BannerSlider } from '../components/common/BannerSlider';
import { CategoryStrip } from '../components/common/CategoryStrip';
import { TimeBasedSection } from '../components/common/TimeBasedSection';
import { useEffect, useState } from 'react';
import { FilterSidebar } from '../components/products/FilterSidebar';
import { Filter, SearchX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HomePage() {
    const { products, searchQuery, selectedCategory } = useStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Redirect functionality for special roles
    useEffect(() => {
        if (user) {
            if (user.role === 'seller') navigate('/seller');
            else if (user.role === 'delivery_man') navigate('/delivery');
            else if (user.role === 'ADMIN') navigate('/admin');
        }
    }, [user, navigate]);

    // Check if there is an active search query (ignoring whitespace)
    const isSearching = searchQuery.trim().length > 0;

    // Filter States
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [minRating, setMinRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'newest'>('recommended');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const filteredProducts = products.filter(product => {
        const safeName = product.name || '';
        const safeCategory = product.category || '';

        const matchesSearch = safeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            safeCategory.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory ? safeCategory === selectedCategory : true;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

        const avgRating = product.reviews && product.reviews.length > 0
            ? product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / product.reviews.length
            : 0;

        const matchesRating = minRating === 0 || avgRating >= minRating;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    // Sort Logic
    filteredProducts.sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'newest') return 0; // Assuming newest first via backend, or we could sort by createdAt if available
        return 0; // recommended
    });

    const handleProductClick = (product: { id: string }) => {
        navigate(`/product/${product.id}`);
    };

    return (
        <MainLayout>
            {!isSearching && (
                <div className="container mx-auto px-4 py-4 space-y-6 md:space-y-8">
                    <CategoryStrip />
                    <BannerSlider />
                    <TimeBasedSection />
                </div>
            )}

            <div className={`container mx-auto px-4 ${isSearching ? 'mt-2 lg:mt-4' : ''}`}>
                <div className="flex items-center justify-between mb-5 mt-2 md:mb-6 md:mt-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {isSearching
                            ? `Search Results for "${searchQuery}"`
                            : selectedCategory
                                ? selectedCategory
                                : 'Trending Now'}
                    </h2>
                    <div className="flex items-center gap-4">
                        {(isSearching || selectedCategory) && (
                            <button
                                onClick={() => {
                                    useStore.getState().setSearchQuery('');
                                    useStore.getState().setSelectedCategory(null);
                                }}
                                className="text-sm font-medium text-primary hover:text-primary-dark"
                            >
                                Clear Search
                            </button>
                        )}
                        <button
                            className="md:hidden flex items-center gap-2 text-sm font-medium px-4 py-2 bg-gray-100 rounded-lg"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                        >
                            <Filter className="w-4 h-4" /> Filters
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 pb-20 md:pb-8">
                    {/* Mobile Filters */}
                    {showMobileFilters && (
                        <div className="md:hidden mb-6">
                            <FilterSidebar
                                priceRange={priceRange} setPriceRange={setPriceRange}
                                minRating={minRating} setMinRating={setMinRating}
                                sortBy={sortBy} setSortBy={setSortBy}
                            />
                        </div>
                    )}

                    {/* Desktop Filters */}
                    <div className="hidden md:block w-72 shrink-0">
                        <FilterSidebar
                            priceRange={priceRange} setPriceRange={setPriceRange}
                            minRating={minRating} setMinRating={setMinRating}
                            sortBy={sortBy} setSortBy={setSortBy}
                        />
                    </div>

                    <div className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center text-center py-24 bg-white/50 backdrop-blur-md rounded-3xl border border-gray-100/50 shadow-sm"
                            >
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <SearchX className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                                <p className="text-gray-500 max-w-sm mb-6">We couldn't find any products matching your current filters. Try tweaking them or clearing completely.</p>
                                <button
                                    onClick={() => {
                                        setMinRating(0);
                                        setPriceRange([0, 50000]);
                                        useStore.getState().setSearchQuery('');
                                        useStore.getState().setSelectedCategory(null);
                                    }}
                                    className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-md hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                                        >
                                            <ProductCard
                                                product={product}
                                                onClick={() => handleProductClick(product)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
