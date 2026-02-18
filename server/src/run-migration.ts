import prisma from './utils/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
    try {
        console.log('Reading migration.sql...');
        const sqlPath = path.join(__dirname, '..', 'migration.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

        // Split by semicolon to get individual statements
        // Filter out empty lines/comments to avoid errors
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} SQL statements. Executing...`);

        for (const [index, sql] of statements.entries()) {
            try {
                process.stdout.write(`Executing statement ${index + 1}... `);
                await prisma.$executeRawUnsafe(sql);
                console.log('✅');
            } catch (err: any) {
                // Ignore "already exists" errors to make it idempotent
                if (err.message && (err.message.includes('already exists') || err.message.includes('Duplicate'))) {
                    console.log('⚠️  (Already exists)');
                } else {
                    console.error('\n❌ Failed:', err.message);
                    // Continue? Or throw? Let's verify at the end.
                }
            }
        }

        console.log('\nMigration execution finished.');

        // Verify by listing tables
        const result: any[] = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log('Tables in DB:', result.map(t => t.table_name));

    } catch (error) {
        console.error('Fatal Migration Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
