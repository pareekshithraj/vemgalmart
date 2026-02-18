import prisma from './utils/prisma';

async function main() {
    try {
        console.log('Attempting to connect to database via Neon Adapter...');
        await prisma.$connect();
        console.log('Successfully connected to database!');

        // Try a simple query
        const count = await prisma.user.count();
        console.log('User count:', count);
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
