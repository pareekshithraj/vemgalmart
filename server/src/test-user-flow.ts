import prisma from './utils/prisma';
import { userService } from './services/userService';
import { hashPassword } from './utils/password';

async function main() {
    try {
        console.log('🧪 Testing User Flow...');

        // 1. Create a Test User manually (bypassing auth api for this test)
        const email = `test.${Date.now()}@vemgal.com`;
        const password = await hashPassword('password123');

        console.log('Creating User:', email);
        const user = await prisma.user.create({
            data: {
                name: 'Test Setup User',
                email,
                phone: '1234567890',
                password,
                role: 'CUSTOMER'
            }
        });
        console.log('✅ User Created:', user.id);

        // 2. Add Address via Service
        console.log('Adding Address...');
        const address = await userService.addAddress(user.id, {
            street: '123 Test St',
            city: 'Vemgal',
            state: 'KA',
            pincode: '563102',
            village: 'Test Village',
            phone: '9876543210',
            alternatePhone: null,
            type: 'home',
            isDefault: true
        });
        console.log('✅ Address Added:', address.id);

        // 3. Fetch Profile via Service
        console.log('Fetching Profile...');
        const profile = await userService.getProfile(user.id);
        console.log('✅ Profile Retrieved:', profile?.email);
        console.log('Addresses:', profile?.addresses.length);

        // Cleanup
        console.log('Cleaning up...');
        await prisma.address.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
        console.log('✅ Cleanup Complete');

    } catch (error) {
        console.error('❌ User Flow Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
