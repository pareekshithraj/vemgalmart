import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({ where: { name: 'Pareekshith Raj' } });
    console.log(JSON.stringify(users.map(u => ({ id: u.id, email: u.email, role: u.role, status: u.status })), null, 2));
}

main().finally(() => prisma.$disconnect());
