import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();
prisma.category.findMany().then(c => {
    fs.writeFileSync('cats.json', JSON.stringify(c, null, 2));
    prisma.$disconnect();
});

