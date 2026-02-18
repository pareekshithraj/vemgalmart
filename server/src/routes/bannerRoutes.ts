import express from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController';
import { authMiddleware, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.get('/', getBanners);
router.post('/', authMiddleware, authorizeRole(['ADMIN']), createBanner);
router.put('/:id', authMiddleware, authorizeRole(['ADMIN']), updateBanner);
router.delete('/:id', authMiddleware, authorizeRole(['ADMIN']), deleteBanner);

export default router;
