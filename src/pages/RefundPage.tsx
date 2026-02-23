import { MainLayout } from '../components/layout/MainLayout';

export function RefundPage() {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Refund and Cancellation Policy</h1>
                <div className="prose prose-green lg:prose-lg mx-auto text-gray-600 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Order Cancellation</h2>
                    <p>
                        <strong>Before Dispatch:</strong> You can cancel your order at any time before it has been dispatched from our
                        partner stores. In such cases, if you have already paid, a full refund will be initiated immediately.
                    </p>
                    <p className="mt-2">
                        <strong>After Dispatch:</strong> Orders cannot be cancelled once they are out for delivery. However, you may
                        refuse to accept the delivery if the items are damaged or defective.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Returns and Refunds</h2>
                    <p>We strive to deliver the best quality products. Returns and refunds are accepted under the following conditions:</p>
                    <ul className="list-disc pl-6 mb-6 mt-4 space-y-2">
                        <li><strong>Damaged or Defective Items:</strong> If you receive products that are damaged, expired, or defective,
                            please report it to our customer support or delivery boy at the time of delivery. A full refund or replacement will be provided.</li>
                        <li><strong>Missing Items:</strong> If an item is missing from your delivered order, we will refund the amount for the
                            missing item or arrange to deliver it separately.</li>
                        <li><strong>Incorrect Items:</strong> If you receive an item different from what you ordered, we will replace it or
                            initiate a refund.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Non-Returnable Items</h2>
                    <p>
                        For hygiene and safety reasons, certain items cannot be returned once accepted:
                    </p>
                    <ul className="list-disc pl-6 mb-6 mt-4 space-y-2">
                        <li>Fresh produce (Fruits and Vegetables) unless reported damaged at the time of delivery.</li>
                        <li>Dairy products and frozen foods.</li>
                        <li>Opened personal care and hygiene products.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Refund Process</h2>
                    <p>
                        Refunds for online payments (UPI, Credit/Debit cards via Razorpay) will be processed back to the original source
                        of payment within 5-7 business days, depending on your bank's processing time. For Cash on Delivery (COD) orders,
                        refunds will be added to your Vemgal Mart Wallet or processed via a bank transfer link provided to you.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Customer Support</h2>
                    <p>
                        If you have an issue with your order, please reach out to us within 24 hours of delivery.
                        <br /><br />
                        <strong>Email:</strong> support@vemgalmart.com<br />
                        <strong>Phone:</strong> +91 XXXXX XXXXX
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
