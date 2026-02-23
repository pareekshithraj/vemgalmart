import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
    {
        name: 'Vegetables & Fruits',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=200',
        description: 'Fresh farm produce'
    },
    {
        name: 'Dairy & Breakfast',
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=200',
        description: 'Milk, Bread, Eggs, Butter'
    },
    {
        name: 'Atta, Rice & Dal',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200',
        description: 'Daily staples and grains'
    },
    {
        name: 'Meat, Fish & Eggs',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=200',
        description: 'Fresh protein'
    },
    {
        name: 'Masalas & Dry Fruits',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=200',
        description: 'Spices and nuts'
    },
    {
        name: 'Sauces & Spreads',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=200',
        description: 'Jams, Ketcup, Sauces'
    },
    {
        name: 'Instant & Frozen Food',
        image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=200',
        description: 'Noodles, Pasta, Frozen snacks'
    },
    {
        name: 'Cold Drinks & Juices',
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=200',
        description: 'Soft drinks and fruit juices'
    },
    {
        name: 'Tea, Coffee & Health Drinks',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=200',
        description: 'Beverages'
    },
    {
        name: 'Ice Creams & Desserts',
        image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=200',
        description: 'Sweet treats'
    },
    {
        name: 'Household Care',
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=200',
        description: 'Cleaning and home essentials'
    },
    {
        name: 'Personal Care',
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=200',
        description: 'Soaps, shampoos, skincare'
    }
];

async function main() {
    console.log('Start seeding categories...');
    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: { image: category.image },
            create: category,
        });
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
