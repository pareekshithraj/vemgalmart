import { MainLayout } from '../components/layout/MainLayout';

export function TermsPage() {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Terms and Conditions</h1>
                <div className="prose prose-green lg:prose-lg mx-auto text-gray-600 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using Vemgal Mart, you accept and agree to be bound by the terms and provision of this agreement.
                        If you do not agree to abide by the above, please do not use this service.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
                    <p>
                        Vemgal Mart provides an online marketplace for purchasing groceries, household items, and other consumer goods.
                        We reserve the right to modify or discontinue any feature without prior notice.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
                    <p>
                        To use certain features of the service, you must register for an account. You are responsible for maintaining
                        the confidentiality of your account information and password. You agree to accept responsibility for all
                        activities that occur under your account.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Pricing and Availability</h2>
                    <p>
                        All prices are subject to change without notice. We make every effort to ensure accurate pricing, but errors
                        may occur. In the event of a pricing error, we reserve the right to cancel any orders placed for that item.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Delivery</h2>
                    <p>
                        Delivery times are estimates and not guarantees. We are not responsible for delays caused by weather,
                        traffic, or other unforeseen circumstances. Delivery is restricted to specific pincodes within Vemgal.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
                    <p>
                        Vemgal Mart shall not be liable for any direct, indirect, incidental, special, or consequential damages
                        resulting from the use or inability to use our services.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Contact Information</h2>
                    <p>
                        For any questions regarding these Terms, please contact us at support@vemgalmart.com.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
