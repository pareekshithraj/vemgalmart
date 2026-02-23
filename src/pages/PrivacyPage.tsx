import { MainLayout } from '../components/layout/MainLayout';

export function PrivacyPage() {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Privacy Policy</h1>
                <div className="prose prose-green lg:prose-lg mx-auto text-gray-600 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <p className="mb-6">
                        At Vemgal Mart, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and
                        protect your personal information when you use our website and mobile application.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>Personal Identification Information:</strong> Name, email address, phone number, and delivery addresses.</li>
                        <li><strong>Payment Information:</strong> Processed securely via Razorpay. We do not store raw credit card numbers.</li>
                        <li><strong>Usage Data:</strong> Information about how you interact with our platform (e.g., browsing history, cart items).</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>To process and deliver your orders accurately.</li>
                        <li>To communicate with you regarding your order status, offers, and updates.</li>
                        <li>To improve our website, customer service, and overall user experience.</li>
                        <li>To process secure payments.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Protection</h2>
                    <p>
                        We implement a variety of security measures to maintain the safety of your personal information.
                        Your personal data is contained behind secured networks and is only accessible by a limited number of
                        persons who have special access rights to such systems.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Sharing Your Information</h2>
                    <p>
                        We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties
                        unless we provide users with advance notice. This does not include website hosting partners and other
                        parties who assist us in operating our business (like delivery partners), so long as those parties agree
                        to keep this information confidential.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Cookies</h2>
                    <p>
                        We use cookies to help us remember and process the items in your shopping cart, understand and save your
                        preferences for future visits, and compile aggregate data about site traffic.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
                    <p>
                        If there are any questions regarding this privacy policy, you may contact us using the information below:
                        <br /><br />
                        <strong>Email:</strong> privacy@vemgalmart.com<br />
                        <strong>Phone:</strong> +91 XXXXX XXXXX
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
