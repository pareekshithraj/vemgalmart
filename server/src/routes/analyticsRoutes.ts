import express from 'express';
import { getAnalytics, getSellerAnalytics } from '../controllers/analyticsController';
import { authMiddleware, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, authorizeRole(['ADMIN']), getAnalytics);
router.get('/seller', authMiddleware, authorizeRole(['SELLER']), getSellerAnalytics);

export default router;
