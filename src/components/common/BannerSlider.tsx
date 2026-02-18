import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../lib/api';

interface Banner {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    displayMode: string;
}

export function BannerSlider() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await api.get('/banners');
                setBanners(response.data);
            } catch (error) {
                console.error('Failed to fetch banners:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // Auto-advance
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    // Touch/Swipe Support
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    if (isLoading) {
        return <div className="h-[250px] md:h-[500px] w-full bg-gray-100 rounded-3xl animate-pulse mb-8 md:mb-12"></div>;
    }

    if (!banners.length) return null;

    return (
        <div
            className="relative h-[200px] sm:h-[350px] md:h-[450px] w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl group touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-black">
                        <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className={`h-full w-full object-cover transition-transform duration-700 ${index === currentIndex ? 'scale-105' : 'scale-100'} opacity-60`}
                        />
                        {banner.displayMode !== 'imageOnly' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        )}
                    </div>

                    {/* Content (Only if NOT imageOnly) */}
                    {banner.displayMode !== 'imageOnly' && (
                        <div className="relative z-20 flex h-full flex-col justify-center px-6 sm:px-16 lg:max-w-3xl">
                            <div className={`transition-all duration-700 delay-100 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <h2 className="mb-2 md:mb-4 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                                    {banner.title}
                                </h2>
                                <p className="mb-4 md:mb-8 text-sm sm:text-lg md:text-xl font-medium text-gray-200 lg:max-w-xl leading-relaxed line-clamp-2 md:line-clamp-none">
                                    {banner.description}
                                </p>
                                <div className="flex gap-4">
                                    {banner.ctaText && (
                                        <Button
                                            className="rounded-xl bg-white px-6 py-2 md:px-8 md:py-4 text-sm md:text-lg font-bold text-gray-900 hover:bg-gray-100 active:scale-95 transition-transform"
                                        >
                                            {banner.ctaText}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Navigation Arrows - Hidden on mobile */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="hidden md:block absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="hidden md:block absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 md:bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:gap-3">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6 md:w-8 bg-white' : 'w-2 md:w-2.5 bg-white/40 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
