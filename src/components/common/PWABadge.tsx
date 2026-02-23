import { useRegisterSW } from 'virtual:pwa-register/react';
import { Download, X } from 'lucide-react';

export function PWABadge() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRegistered(r: any) {
            console.log('SW Registered: ', r);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRegisterError(error: any) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setNeedRefresh(false);
    };

    if (!needRefresh) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full animate-slide-up">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <Download className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">App Update Available!</h3>
                        <p className="text-xs text-gray-500 mt-0.5">A new version of Vemgal Mart is ready.</p>
                    </div>
                </div>
                <button onClick={close} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="flex gap-2.5 mt-4">
                <button
                    onClick={() => updateServiceWorker(true)}
                    className="flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
                >
                    Update Now
                </button>
            </div>
        </div>
    );
}
