
async function verify() {
    const API_URL = 'http://localhost:5000/api';
    try {
        console.log('🧪 Verifying API endpoints...');

        // 1. Check Products
        console.log('GET /api/products');
        const productsRes = await fetch(`${API_URL}/products`);
        if (!productsRes.ok) throw new Error(`Products failed: ${productsRes.status}`);
        const products = await productsRes.json();
        console.log('✅ Products received:', products.length);

        // 2. Check Auth Login (Seeded Seller)
        console.log('POST /api/auth/login');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'seller@vemgal.com',
                password: 'seller123'
            })
        });
        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        console.log('✅ Login successful for:', loginData.user.email);
        console.log('Token:', loginData.token.substring(0, 20) + '...');

        console.log('✨ All verifications passed!');
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ Verification failed:', error.message);
        } else {
            console.error('❌ Verification failed:', String(error));
        }
    }
}

verify();
