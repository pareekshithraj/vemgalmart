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
                title: "Good Morning! ☀️",
                message: "Start your day fresh with dairy & breakfast essentials.",
                categories: ['Dairy', 'Bakery', 'Fruits'],
                icon: <Sun className="h-6 w-6 text-yellow-500" />,
                bgClass: "bg-orange-50/50 border-orange-100"
            };
        } else if (currentHour >= 11 && currentHour < 16) {
            return {
                title: "Lunch Time Prep 🍛",
                message: "Everything you need for a hearty meal.",
                categories: ['Rice & Grains', 'Chicken & Meat', 'Fresh Vegetables'],
                icon: <Utensils className="h-6 w-6 text-orange-500" />,
                bgClass: "bg-red-50/50 border-red-100"
            };
        } else if (currentHour >= 16 && currentHour < 21) {
            return {
                title: "Evening Cravings? 😋",
                message: "Time for some chatpata snacks & street food!",
                categories: ['Snacks', 'Street Food', 'Beverages'],
                icon: <Coffee className="h-6 w-6 text-brown-500" />,
                bgClass: "bg-amber-50/50 border-amber-100"
            };
        } else {
            return {
                title: "Late Night Munchies 🌙",
                message: "Satisfy those midnight hunger pangs.",
                categories: ['Frozen Foods', 'Beverages', 'Instant Food', 'Snacks'],
                icon: <Moon className="h-6 w-6 text-indigo-500" />,
                bgClass: "bg-indigo-50/50 border-indigo-100"
            };
        }
    }, [currentHour]);

    const filteredProducts = products.filter(p =>
        timeConfig.categories.some(cat => p.category.includes(cat) || p.category === cat)
    );

    // If no filtered products found (e.g. no products for that category yet), fallback to some defaults
    const displayProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 4);

    return (
        <div className={`mb-12 rounded-3xl border p-8 ${timeConfig.bgClass}`}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {timeConfig.icon}
                        <h2 className="text-2xl font-bold text-gray-900">{timeConfig.title}</h2>
                    </div>
                    <p className="text-gray-600">{timeConfig.message}</p>
                </div>
                <button className="text-sm font-semibold text-primary hover:underline">See All</button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {displayProducts.slice(0, 4).map(product => (
                    <div key={product.id} className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
