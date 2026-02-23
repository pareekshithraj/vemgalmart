import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const submitReview = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId as string;
        const { rating, comment } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Ideally, we check if the user actually ordered the product here.
        // For demonstration, we allow any logged-in user to review.
        /*
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: { userId, status: 'DELIVERED' }
            }
        });
        if (!hasPurchased) return res.status(403).json({ message: 'You can only review products you have purchased and received.' });
        */

        // Create or update review
        const review = await prisma.review.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            },
            update: {
                rating: Number(rating),
                comment: comment || null,
            },
            create: {
                userId,
                productId,
                rating: Number(rating),
                comment: comment || null,
            }
        });

        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (error) {
        console.error('Submit Review Error:', error);
        res.status(500).json({ message: 'Error submitting review' });
    }
};

export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId as string;

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: { user: { select: { name: true } } }, // Fetch reviewer's name
            orderBy: { createdAt: 'desc' }
        });

        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / totalReviews
            : 0;

        res.status(200).json({
            averageRating: averageRating.toFixed(1),
            totalReviews,
            reviews
        });
    } catch (error) {
        console.error('Fetch Reviews Error:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};
