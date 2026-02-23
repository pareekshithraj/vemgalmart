import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getWishlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const wishlist = await prisma.wishlist.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        seller: { select: { id: true, name: true, shopName: true } },
                        reviews: { select: { rating: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res.status(200).json(wishlist.map((w: any) => w.product));
    } catch (error) {
        console.error('Get Wishlist Error:', error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
};

export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'Product ID is required' });

        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId,
                productId
            }
        });

        res.status(201).json({ message: 'Added to wishlist', wishlistItem });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        console.error('Add to Wishlist Error:', error);
        res.status(500).json({ message: 'Error adding to wishlist' });
    }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const productId = req.params.productId as string;

        await prisma.wishlist.deleteMany({
            where: {
                userId,
                productId
            }
        });

        res.status(200).json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Remove from Wishlist Error:', error);
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
};
