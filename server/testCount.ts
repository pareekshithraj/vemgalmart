import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const products = await prisma.product.findMany({ where: { sellerId: '3d7b4e83-9330-4704-afd1-bd1a35095696' } });
    console.log('User Products:', products.map(p => p.name));
}
main().finally(() => prisma.$disconnect());
