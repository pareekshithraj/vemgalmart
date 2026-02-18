import { useNavigate, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProductCard } from '../components/common/ProductCard';
import { MainLayout } from '../components/layout/MainLayout';
import { BannerSlider } from '../components/common/BannerSlider';
import { CategoryStrip } from '../components/common/CategoryStrip';
import { TimeBasedSection } from '../components/common/TimeBasedSection';
import { useEffect } from 'react';

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

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;

        return matchesSearch && matchesCategory;
    });

    const handleProductClick = (product: any) => {
        navigate(`/product/${product.id}`);
    };

    return (
        <MainLayout>
            {!isSearching && (
                <div className="container mx-auto px-4 py-4 space-y-6">
                    <CategoryStrip />
                    <BannerSlider />
                    <TimeBasedSection />
                </div>
            )}

            <div className="container mx-auto px-4">
                <div className="mb-6 flex items-center justify-between mt-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {isSearching
                            ? `Search Results for "${searchQuery}"`
                            : selectedCategory
                                ? selectedCategory
                                : 'Trending Now'}
                    </h2>
                    {(isSearching || selectedCategory) && (
                        <button
                            onClick={() => {
                                useStore.getState().setSearchQuery('');
                                useStore.getState().setSelectedCategory(null);
                            }}
                            className="text-sm font-medium text-primary hover:text-primary-dark"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No products found matching "{searchQuery}"</p>
                        <p className="text-gray-400 mt-2">Try checking your spelling or using different keywords.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 pb-20 md:pb-8">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => handleProductClick(product)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
