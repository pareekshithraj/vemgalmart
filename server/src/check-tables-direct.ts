import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import ws from 'ws';
import path from 'path';

// Explicitly load .env from project root
const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
console.log('Direct Check: DATABASE_URL is', connectionString ? 'Defined' : 'Missing');

if (!connectionString) {
    console.error('❌ DATABASE_URL is missing. Exiting.');
    process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log('Testing connection...');
        await prisma.$connect();
        console.log('✅ Connected!');

        const tables: any[] = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log('Tables in DB:', tables.map(t => t.table_name));
    } catch (e) {
        console.error('❌ Direct Check Failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
