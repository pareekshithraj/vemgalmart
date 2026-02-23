import { create } from 'zustand';
import type { Product, CartItem, Order, User, Banner } from '../types';

interface StoreState {
    user: User | null;
    banners: Banner[];
    products: Product[];
    cart: CartItem[];
    orders: Order[];
    wishlist: Product[];
    searchQuery: string;
    selectedCategory: string | null;

    // Actions
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string | null) => void;
    setOrders: (orders: Order[]) => void;
    setProducts: (products: Product[]) => void;
    fetchBanners: () => Promise<void>;
    fetchProducts: () => Promise<void>;
    fetchCart: () => Promise<void>;
    fetchWishlist: () => Promise<void>;
    toggleWishlist: (productId: string) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addProduct: (productData: any) => Promise<Product>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateProduct: (productId: string, productData: any) => Promise<Product>;
    deleteProduct: (productId: string) => Promise<void>;
    addToCart: (product: Product) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    placeOrder: (order: Order) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateOrderStatus: (orderId: string, status: string, extraData?: any) => Promise<void>;
    assignDeliveryMan: (orderId: string, deliveryManId: string) => Promise<void>;
    reset: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
    user: null, // Managed by useAuthStore
    banners: [],
    products: [],
    cart: [],
    orders: [],
    wishlist: [],
    searchQuery: '',
    selectedCategory: null,

    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setOrders: (orders) => set({ orders }),
    setProducts: (products) => set({ products }),

    fetchBanners: async () => {
        try {
            // If we have a banner endpoint, use it. Otherwise, defaults to empty []
            // const response = await import('../lib/api').then(m => m.default.get('/banners'));
            // set({ banners: response.data });
            // For now, since we cleared DB, banners are empty. 
            // We can fetch from '/banners' if implemented.
            // Let's assume there is a /banners endpoint based on file existence.
            const response = await import('../lib/api').then(m => m.default.get('/banners'));
            set({ banners: response.data });
        } catch (error) {
            console.error('Failed to fetch banners:', error);
            // Fallback to empty if fails
            set({ banners: [] });
        }
    },

    fetchProducts: async () => {
        try {
            const response = await import('../lib/api').then(m => m.default.get('/products'));
            set({ products: response.data });
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    },

    fetchWishlist: async () => {
        try {
            const response = await import('../lib/api').then(m => m.default.get('/wishlist'));
            set({ wishlist: response.data });
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        }
    },

    toggleWishlist: async (productId: string) => {
        const state = get();
        const inWishlist = state.wishlist.some(p => p.id === productId);
        try {
            if (inWishlist) {
                await import('../lib/api').then(m => m.default.delete(`/wishlist/${productId}`));
                set({ wishlist: state.wishlist.filter(p => p.id !== productId) });
            } else {
                await import('../lib/api').then(m => m.default.post('/wishlist', { productId }));
                await state.fetchWishlist();
            }
        } catch (error) {
            console.error('Failed to toggle wishlist:', error);
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addProduct: async (productData: any) => {
        try {
            const response = await import('../lib/api').then(m => m.default.post('/products', productData));
            set((state) => ({ products: [...state.products, response.data.product] }));
            return response.data.product;
        } catch (error) {
            console.error('Failed to add product:', error);
            throw error;
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateProduct: async (productId: string, productData: any) => {
        try {
            const response = await import('../lib/api').then(m => m.default.put(`/products/${productId}`, productData));
            set((state) => ({
                products: state.products.map(p => p.id === productId ? { ...p, ...response.data.product } : p)
            }));
            return response.data.product;
        } catch (error) {
            console.error('Failed to update product:', error);
            throw error;
        }
    },

    deleteProduct: async (productId: string) => {
        try {
            await import('../lib/api').then(m => m.default.delete(`/products/${productId}`));
            set((state) => ({
                products: state.products.filter(p => p.id !== productId)
            }));
        } catch (error) {
            console.error('Failed to delete product:', error);
            throw error;
        }
    },

    fetchCart: async () => {
        try {
            const response = await import('../lib/api').then(m => m.default.get('/cart'));
            if (response.data && response.data.items) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedCart = response.data.items.map((item: any) => ({
                    ...item.product,
                    quantity: item.quantity,
                    cartItemId: item.id
                }));
                set({ cart: mappedCart });
            }
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (error?.response?.status !== 401) {
                console.error('Failed to fetch cart:', error);
            }
        }
    },

    addToCart: async (product) => {
        try {
            // Optimistic update
            // const state = get();
            // We can't easily optimistic update 'cartItemId' for new items, so we rely on fetchCart after.

            await import('../lib/api').then(m => m.default.post('/cart/add', {
                productId: product.id,
                quantity: 1
            }));

            // Refresh cart to get the correct state and IDs
            await get().fetchCart();
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    },

    removeFromCart: async (productId) => {
        try {
            const state = get();
            const item = state.cart.find(i => i.id === productId);
            if (!item?.cartItemId) return;

            await import('../lib/api').then(m => m.default.delete(`/cart/item/${item.cartItemId}`));

            set((state) => ({
                cart: state.cart.filter(item => item.id !== productId)
            }));
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    },

    updateCartQuantity: async (productId, quantity) => {
        try {
            const state = get();
            const item = state.cart.find(i => i.id === productId);
            if (!item?.cartItemId) return;

            if (quantity <= 0) {
                await get().removeFromCart(productId);
                return;
            }

            await import('../lib/api').then(m => m.default.put(`/cart/item/${item.cartItemId}`, { quantity }));

            // Optimistic update for UI responsiveness
            set((state) => ({
                cart: state.cart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            }));
        } catch (error) {
            console.error('Failed to update cart quantity:', error);
            // Rollback could be added here
        }
    },

    clearCart: async () => {
        try {
            await import('../lib/api').then(m => m.default.delete('/cart/clear'));
            set({ cart: [] });
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    },

    placeOrder: (order) => set((state) => ({
        orders: [order, ...state.orders],
        cart: []
    })),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateOrderStatus: async (orderId, status, extraData) => {
        try {
            await import('../lib/api').then(m => m.default.put(`/orders/${orderId}/status`, { status, ...extraData }));
            set((state) => ({
                orders: state.orders.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o)
            }));
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    },

    assignDeliveryMan: async (orderId, deliveryManId) => {
        try {
            await import('../lib/api').then(m => m.default.put(`/orders/${orderId}/assign`));
            set((state) => ({
                orders: state.orders.map(o => o.id === orderId ? { ...o, deliveryManId, status: 'preparing' } : o)
            }));
        } catch (error) {
            console.error('Failed to assign delivery man:', error);
        }
    },

    reset: () => set({ cart: [], orders: [], user: null, searchQuery: '' })
}));
