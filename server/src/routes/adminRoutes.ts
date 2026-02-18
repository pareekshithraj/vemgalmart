import { Router } from 'express';
import { getPendingUsers, updateUserStatus, getDashboardStats, getAllUsers } from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

router.get('/pending-users', getPendingUsers);
router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);
router.put('/users/:userId/status', updateUserStatus);

export default router;
