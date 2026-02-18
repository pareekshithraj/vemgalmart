import type { ReactNode } from 'react';
import { Navbar } from '../common/Navbar';
import { BottomNav } from '../common/BottomNav';
import { CartDrawer } from '../cart/CartDrawer';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">
            <Navbar />
            <CartDrawer />

            <main className="flex-grow pt-16">
                {children}
            </main>

            <BottomNav />
        </div>
    );
}
