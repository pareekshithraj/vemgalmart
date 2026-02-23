
import prisma from './utils/prisma';

async function main() {
    console.log('🌱 Starting database seed...');

    // 1. Categories
    const categories = [
        {
            name: 'Fresh Vegetables',
            image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=2000&auto=format&fit=crop',
            description: 'Farm fresh vegetables delivered daily.'
        },
        {
            name: 'Fresh Fruits',
            image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2000&auto=format&fit=crop',
            description: 'Juicy and seasonal fruits.'
        },
        {
            name: 'Dairy & Breakfast',
            image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=2000&auto=format&fit=crop',
            description: 'Milk, curd, bread, and morning essentials.'
        },
        {
            name: 'Rice, Atta & Dals',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2000&auto=format&fit=crop',
            description: 'Quality grains and pulses.'
        },
        {
            name: 'Masalas & Spices',
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2000&auto=format&fit=crop',
            description: 'Authentic spices for your kitchen.'
        },
        {
            name: 'Snacks & Biscuits',
            image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=2000&auto=format&fit=crop',
            description: 'Tasty treats for tea time.'
        },
        {
            name: 'Cold Drinks & Juices',
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=2000&auto=format&fit=crop',
            description: 'Refreshing beverages for summer.'
        },
        {
            name: 'Cleaning & Household',
            image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=2000&auto=format&fit=crop',
            description: 'Essentials for a clean home.'
        },
        {
            name: 'Personal Care',
            image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2000&auto=format&fit=crop',
            description: 'Soaps, shampoos, and skincare.'
        }
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: { image: cat.image },
            create: cat
        });
    }
    console.log('✅ Categories seeded');

    // 2. Banners
    const banners = [
        {
            title: 'Fresh from Farm',
            description: 'Get fresh vegetables delivered to your doorstep every morning.',
            imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=2000&auto=format&fit=crop',
            ctaText: 'Shop Fresh',
            ctaLink: '/category/fresh-vegetables',
            displayMode: 'default',
            order: 1,
            isActive: true
        },
        {
            title: 'Weekly Super Saver',
            description: 'Up to 40% OFF on household essentials this week.',
            imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=2000&auto=format&fit=crop', // Shopping cart or supermarket aisle
            ctaText: 'View Offers',
            ctaLink: '/offers',
            displayMode: 'default',
            order: 2,
            isActive: true
        },
        {
            title: 'Best Quality Rice',
            description: 'Premium Sona Masoori and Basmati rice at wholesale prices.',
            imageUrl: 'https://images.unsplash.com/photo-1536304993881-ffc0213063f4?q=80&w=2000&auto=format&fit=crop',
            ctaText: 'Buy Now',
            ctaLink: '/category/rice-atta-dals',
            displayMode: 'default',
            order: 3,
            isActive: true
        }
    ];

    // Clear existing banners first to avoid duplicates/clutter if re-seeding
    await prisma.banner.deleteMany({});

    for (const banner of banners) {
        await prisma.banner.create({
            data: banner
        });
    }
    console.log('✅ Banners seeded');

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
