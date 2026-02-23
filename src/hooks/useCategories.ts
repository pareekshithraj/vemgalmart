import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface Category {
    id: string;
    name: string;
    image: string;
    description?: string;
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setError(err instanceof Error ? err.message : 'Failed to load categories');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, isLoading, error };
}
