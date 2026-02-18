import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import ws from 'ws';

import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configure Neon to use WebSockets
neonConfig.webSocketConstructor = ws;

// Create connection string
let connectionString = process.env.DATABASE_URL;
if (connectionString && connectionString.startsWith('"') && connectionString.endsWith('"')) {
    connectionString = connectionString.slice(1, -1);
}

console.log('Prisma Utils: connectionString loaded from env?', !!connectionString);
if (connectionString) {
    console.log('Prisma Utils: connectionString prefix:', connectionString.substring(0, 15) + '...');
} else {
    console.error('Prisma Utils: CRITICAL - DATABASE_URL is missing!');
}

// Create Neon Pool
const pool = new Pool({ connectionString: connectionString! });
const adapter = new PrismaNeon(pool as any);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
