import { MainLayout } from '../components/layout/MainLayout';
import { Phone, MessageCircle, ChevronRight, HelpCircle } from 'lucide-react';

export function SupportPage() {
    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
                    <p className="text-gray-500">We are here to assist you with any issues or queries.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all cursor-pointer">
                        <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                            <MessageCircle className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Chat with Us</h3>
                        <p className="text-sm text-gray-500">Get instant answers 24/7</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all cursor-pointer">
                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                            <Phone className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Call Support</h3>
                        <p className="text-sm text-gray-500">Speak to our agents</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {['Where is my order?', 'How to cancel an order?', 'Refund policy', 'Payment issues'].map((faq, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="h-5 w-5 text-gray-400 group-hover:text-primary" />
                                    <span className="text-gray-700 font-medium">{faq}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-300" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-400">
                    <p>Vemgal Mart Customer Care • Version 1.0.0</p>
                </div>
            </div>
        </MainLayout>
    );
}
