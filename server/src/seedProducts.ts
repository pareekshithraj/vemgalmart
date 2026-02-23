import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyProducts = [
    {
        name: 'Fresh Red Apples',
        description: 'Crisp and sweet red apples, perfect for snacking or baking.',
        price: 150,
        originalPrice: 180,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcc6?w=500&q=80',
        categoryId: 'veg-fruits',
        isActive: true
    },
    {
        name: 'Whole Wheat Bread',
        description: 'Freshly baked whole wheat bread, rich in fiber.',
        price: 45,
        originalPrice: 55,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
        categoryId: 'dairy-bakery',
        isActive: true
    },
    {
        name: 'Premium Basmati Rice',
        description: 'Long grain, aromatic basmati rice for perfect biryanis.',
        price: 850,
        originalPrice: 999,
        stock: 100,
        image: 'https://images.unsplash.com/photo-1593010915464-91893fb271be?w=500&q=80',
        categoryId: 'staples',
        isActive: true
    },
    {
        name: 'Almond Hair Oil',
        description: 'Nourishing almond hair oil for strong and healthy hair.',
        price: 220,
        originalPrice: 250,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
        categoryId: 'personal-care',
        isActive: true
    },
    {
        name: 'Tomato Ketchup',
        description: 'Rich and thick tomato ketchup made from fresh tomatoes.',
        price: 130,
        originalPrice: 150,
        stock: 60,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5e16ba789?w=500&q=80',
        categoryId: 'sauces-spreads',
        isActive: true
    },
    {
        name: 'Lays Classic Salted',
        description: 'Crispy potato chips with a perfect blend of salt.',
        price: 20,
        originalPrice: 20,
        stock: 200,
        image: 'https://images.unsplash.com/photo-1566478989037-e924e50cb0c2?w=500&q=80',
        categoryId: 'snacks',
        isActive: true
    }
];

async function seedProducts() {
    try {
        console.log('Seeding products...');

        // Find an admin or seller user to assign these products to
        let seller = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (!seller) {
            console.error('No ADMIN user found to act as seller. Please register an admin user first.');
            return;
        }

        // Fetch available categories to map the foreign keys properly
        const categories = await prisma.category.findMany();

        for (const product of dummyProducts) {
            const { categoryId, ...productData } = product;

            // Try to find the matching category ID by name, or fallback to the first category
            let assignedCategory = categories.find(c =>
                c.name.toLowerCase().includes(categoryId.replace('-', ' ')) ||
                categoryId.includes(c.name.toLowerCase())
            );

            if (!assignedCategory && categories.length > 0) {
                assignedCategory = categories[0];
            }

            await prisma.product.create({
                data: {
                    ...productData,
                    category: assignedCategory ? assignedCategory.name : categoryId,
                    categoryId: assignedCategory ? assignedCategory.id : categoryId,
                    sellerId: seller.id
                }
            });
        }

        console.log('✅ 6 Dummy Products seeded successfully!');
    } catch (error) {
        console.error('Error seeding products:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedProducts();
