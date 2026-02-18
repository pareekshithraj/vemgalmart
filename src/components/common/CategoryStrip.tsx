import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useStore } from '../../store/useStore';

export function CategoryStrip() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { categories, isLoading } = useCategories();
    const { selectedCategory, setSelectedCategory } = useStore();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (isLoading) {
        return <div className="h-40 animate-pulse bg-gray-100 rounded-xl mb-8 mx-4 sm:mx-0"></div>;
    }

    if (categories.length === 0) return null;

    return (
        <div className="relative group bg-white py-4 shadow-sm rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 px-6">Shop by Category</h2>

            {/* Scroll Buttons */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -ml-4"
            >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -mr-4"
            >
                <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide px-6 snap-x items-center"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                        className={`flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group/item snap-start transition-opacity duration-300 ${selectedCategory && selectedCategory !== category.name ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}
                    >
                        <div className={`h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 ${selectedCategory === category.name ? 'ring-2 ring-primary ring-offset-2 scale-105' : 'hover:shadow-md hover:scale-105'}`}>
                            <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                            />
                        </div>
                        <span className={`text-xs sm:text-sm font-medium text-center truncate w-24 transition-colors ${selectedCategory === category.name ? 'text-primary font-bold' : 'text-gray-700 group-hover/item:text-primary'}`}>
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
