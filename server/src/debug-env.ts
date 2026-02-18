import dotenv from 'dotenv';
import path from 'path';

console.log('Debug: Starting script...');
const envPath = path.join(process.cwd(), '.env');
console.log('Debug: Loading env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Debug: Dotenv Error:', result.error);
} else {
    console.log('Debug: Dotenv Success. Parsed keys:', Object.keys(result.parsed || {}));
}

console.log('Debug: DATABASE_URL present?', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('Debug: DATABASE_URL prefix:', process.env.DATABASE_URL.substring(0, 15));
}
