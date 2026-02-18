import { useEffect, useRef } from 'react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

export const useServerWakeup = () => {
    const { addToast } = useToast();
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;

        const checkServer = async () => {
            const start = Date.now();
            try {
                // Ping the root endpoint (which typically returns "API Running")
                // We use a timeout to detect if it's lagging (cold start)
                await api.get('/', { timeout: 10000 });
            } catch (error) {
                // If it fails or times out, it might be waking up or down
                console.log('Server wake-up check:', error);
            } finally {
                const duration = Date.now() - start;
                // If it took more than 2 seconds, it was likely sleeping
                if (duration > 2000) {
                    addToast('Server woken up! You can now use the app.', 'success');
                }
            }
        };

        // Only run this if we are likely in production/deployed environment where cold starts happen
        // But for this user request, we run it always or just check logic.
        // To avoid spamming in dev, maybe check hostname? 
        // For now, let's just run it.
        checkServer();
    }, [addToast]);
};
