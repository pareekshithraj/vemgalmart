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
        <div className="relative group py-2">
            <div className="flex items-center justify-between px-2 mb-5">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Explore Categories</h2>
            </div>

            {/* Scroll Buttons */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 z-10 rounded-full bg-white/90 backdrop-blur-md p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -ml-2 sm:-ml-4 border border-gray-100"
            >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 z-10 rounded-full bg-white/90 backdrop-blur-md p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -mr-2 sm:-mr-4 border border-gray-100"
            >
                <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2 snap-x items-start"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                        className={`flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group/item snap-start transition-all duration-300 w-[72px] sm:w-20 ${selectedCategory && selectedCategory !== category.name ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}
                    >
                        <div className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden transition-all duration-300 bg-white flex items-center justify-center p-0.5 ${selectedCategory === category.name ? 'ring-4 ring-primary/30 scale-105 shadow-md' : 'ring-1 ring-gray-200/60 shadow-sm hover:shadow-md hover:scale-105 hover:ring-primary/20'}`}>
                            <div className="h-full w-full rounded-full overflow-hidden bg-gray-50">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                                />
                            </div>
                        </div>
                        <span className={`text-[11px] sm:text-xs font-semibold text-center leading-tight transition-colors ${selectedCategory === category.name ? 'text-primary' : 'text-gray-600 group-hover/item:text-gray-900'}`}>
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
