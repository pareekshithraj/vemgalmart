import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany();
    console.log(JSON.stringify(users.map(u => ({ id: u.id, name: u.name, role: u.role, status: u.status })), null, 2));
}
main().finally(() => prisma.$disconnect());
