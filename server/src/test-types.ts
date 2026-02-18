import { PrismaClient, UserStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const u: { status: UserStatus } = { status: UserStatus.APPROVED };
    console.log(u.status);

    // Check if User type has status
    // @ts-ignore
    const userExample: import('@prisma/client').User = {
        status: UserStatus.APPROVED
    };
    console.log(userExample.status);
}

main();
