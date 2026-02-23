import type { ReactNode } from 'react';
import { Navbar } from '../common/Navbar';
import { CartDrawer } from '../cart/CartDrawer';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-4">
            <Navbar />
            <CartDrawer />

            <main className="flex-grow pt-2 md:pt-6">
                {children}
            </main>

            {/* Simple Footer for Legal Links */}
            <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-500 pb-8 mt-auto">
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                    <a href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</a>
                    <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="/refund" className="hover:text-primary transition-colors">Refund & Cancellation</a>
                </div>
                <p>&copy; {new Date().getFullYear()} Vemgal Mart. All rights reserved.</p>
            </footer>
        </div>
    );
}
