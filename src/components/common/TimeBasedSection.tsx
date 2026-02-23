import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ProductCard } from './ProductCard';
import { Sun, Moon, Coffee, Utensils } from 'lucide-react';

export function TimeBasedSection() {
    const { products } = useStore();

    // Get current hour for demo (Simulate time if needed, currently using system time)
    const currentHour = new Date().getHours();

    // Logic for time-based content
    // Morning: 6am - 11am (Dairy, Eggs, Bread)
    // Afternoon: 11am - 4pm (Rice, Spices, Instant Food)
    // Evening: 4pm - 9pm (Snacks, Street Food)
    // Night: 9pm - 6am (Beverages, Frozen Foods) -- fallback or specific

    // For Demo: You can force a specific 'mode' here or stick to real time

    const timeConfig = useMemo(() => {
        if (currentHour >= 6 && currentHour < 11) {
            return {
                title: "Good Morning!",
                message: "Start your day fresh with dairy & breakfast essentials.",
                categories: ['Dairy', 'Bakery', 'Fruits'],
                icon: <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />,
                bgClass: "bg-gradient-to-br from-orange-50/90 to-amber-50/50 border-orange-200/60 shadow-inner"
            };
        } else if (currentHour >= 11 && currentHour < 16) {
            return {
                title: "Lunch Time Prep",
                message: "Everything you need for a hearty meal.",
                categories: ['Rice & Grains', 'Chicken & Meat', 'Fresh Vegetables'],
                icon: <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />,
                bgClass: "bg-gradient-to-br from-red-50/90 to-orange-50/40 border-red-200/60 shadow-inner"
            };
        } else if (currentHour >= 16 && currentHour < 21) {
            return {
                title: "Evening Cravings?",
                message: "Time for some chatpata snacks & street food!",
                categories: ['Snacks', 'Street Food', 'Beverages'],
                icon: <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />,
                bgClass: "bg-gradient-to-br from-amber-50/90 to-yellow-50/40 border-amber-200/60 shadow-inner"
            };
        } else {
            return {
                title: "Late Night Munchies",
                message: "Satisfy those midnight hunger pangs.",
                categories: ['Frozen Foods', 'Beverages', 'Instant Food', 'Snacks'],
                icon: <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />,
                bgClass: "bg-gradient-to-br from-indigo-50/90 to-purple-50/40 border-indigo-200/60 shadow-inner"
            };
        }
    }, [currentHour]);

    const filteredProducts = products.filter(p =>
        timeConfig.categories.some(cat => p.category.includes(cat) || p.category === cat)
    );

    // If no filtered products found (e.g. no products for that category yet), fallback to some defaults
    const displayProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 4);

    if (displayProducts.length === 0) return null;

    return (
        <div className={`mb-8 sm:mb-12 rounded-[24px] sm:rounded-3xl border p-5 sm:p-8 ${timeConfig.bgClass}`}>
            <div className="mb-5 sm:mb-6 flex flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {timeConfig.icon}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{timeConfig.title}</h2>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{timeConfig.message}</p>
                </div>
                <button className="text-sm font-semibold text-primary hover:underline whitespace-nowrap pt-1 sm:pt-0 shrink-0">See All</button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                {displayProducts.slice(0, 4).map(product => (
                    <div key={product.id} className="bg-white/80 backdrop-blur-md rounded-3xl p-1 sm:p-2 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
