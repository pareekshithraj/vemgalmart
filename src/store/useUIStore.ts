import { create } from 'zustand';
import type { Product } from '../types';

interface UIState {
    isCartOpen: boolean;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    isProductModalOpen: boolean;
    selectedProduct: Product | null;
    openProductModal: (product: Product) => void;
    closeProductModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isCartOpen: false,
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),

    isProductModalOpen: false,
    selectedProduct: null,
    openProductModal: (product) => set({ isProductModalOpen: true, selectedProduct: product }),
    closeProductModal: () => set({ isProductModalOpen: false, selectedProduct: null }),
}));
