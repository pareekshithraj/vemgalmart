import { Pool, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import ws from 'ws';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

neonConfig.webSocketConstructor = ws;

let connectionString = process.env.DATABASE_URL;
if (connectionString && connectionString.startsWith('"') && connectionString.endsWith('"')) {
    connectionString = connectionString.slice(1, -1);
}

console.log('PG Test: URL length:', connectionString?.length);
console.log('PG Test: URL prefix:', connectionString?.substring(0, 15));

const pool = new Pool({ connectionString });

async function main() {
    try {
        console.log('Connecting via PG Pool...');
        const client = await pool.connect();
        console.log('✅ Connected!');

        const res = await client.query('SELECT NOW()');
        console.log('Query Result:', res.rows[0]);

        client.release();
    } catch (err) {
        console.error('❌ PG Connection Failed:', err);
    } finally {
        await pool.end();
    }
}

main();
