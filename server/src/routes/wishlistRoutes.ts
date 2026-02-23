import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Protect all wishlist routes
router.use(authMiddleware);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
