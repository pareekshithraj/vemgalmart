import { Request, Response } from 'express';
import { cartService } from '../services/cartService';

export const getCart = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { productId, quantity } = req.body;
        const item = await cartService.addToCart(req.user.id, productId, quantity || 1);
        res.status(201).json({ message: 'Added to cart', item });
    } catch (error) {
        console.error('Add To Cart Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { quantity } = req.body;
        const item = await cartService.updateCartItem(id, quantity);
        res.status(200).json({ message: 'Cart updated', item });
    } catch (error) {
        console.error('Update Cart Item Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await cartService.removeFromCart(id);
        res.status(200).json({ message: 'Removed from cart' });
    } catch (error) {
        console.error('Remove From Cart Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const clearCart = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        await cartService.clearCart(req.user.id);
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear Cart Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
