import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const prods = await prisma.product.findMany({ include: { seller: true } });
    console.log(JSON.stringify(prods.map(p => ({ id: p.id, name: p.name, sellerId: p.sellerId, sellerName: p.seller.name })), null, 2));
}

main().finally(() => prisma.$disconnect());
