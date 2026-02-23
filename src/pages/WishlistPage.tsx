import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function WishlistPage() {
    const { wishlist } = useStore();
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1 rounded-full">
                        {wishlist.length} Items
                    </span>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-red-300" strokeWidth={2} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Looks like you haven't added anything to your wishlist yet.
                            Explore our catalog to find products you love!
                        </p>
                        <Button
                            onClick={() => navigate('/')}
                            size="lg"
                            className="rounded-xl px-8"
                        >
                            <ShoppingBag className="w-5 h-5 mr-2" /> Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-20">
                        {wishlist.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => navigate(`/product/${product.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
