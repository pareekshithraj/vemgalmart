import express from 'express';
import { createCoupon, getCoupons, updateCoupon, deleteCoupon, validateCoupon } from '../controllers/couponController';
import { authMiddleware, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Public route for users to validate a coupon against their cart
router.post('/validate', authMiddleware, validateCoupon);

// Admin-only routes for managing coupons
router.use(authMiddleware, authorizeRole(['ADMIN']));
router.get('/', getCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
