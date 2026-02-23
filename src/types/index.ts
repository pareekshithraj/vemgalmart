export type UserRole = 'buyer' | 'seller' | 'delivery_man' | 'ADMIN';

export interface Banner {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    displayMode?: 'default' | 'imageOnly';
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    stock?: number;
    image: string;
    images?: string[];
    category: string;
    sellerId: string;
    brand?: string;
    reviews?: { rating: number }[];
    seller?: {
        id: string;
        name: string;
        shopName?: string;
    };
}

export interface CartItem extends Product {
    quantity: number;
    cartItemId?: string; // Optional for optimistic updates or legacy
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'out_for_delivery' | 'delivered';
    customerName: string;
    deliveryAddress: string;
    deliveryManId?: string; // assigned delivery man
    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
    avatar?: string;
    phone?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
}
