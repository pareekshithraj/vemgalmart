import { Router } from 'express';
import { submitReview, getProductReviews } from '../controllers/reviewController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Publicly fetch reviews for a product
router.get('/:productId', getProductReviews);

// Must be logged in to post a review
router.post('/:productId', authMiddleware, submitReview);

export default router;
