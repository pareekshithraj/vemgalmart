import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getProfile, updateProfile, addAddress, getAddresses, deleteAddress, updateAddress, saveFcmToken } from '../controllers/userController';

const router = Router();

router.use(authMiddleware); // Protect all routes

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/address', addAddress);
router.get('/address', getAddresses);
router.delete('/address/:id', deleteAddress);
router.put('/address/:id', updateAddress);
router.post('/fcm-token', saveFcmToken);

export default router;
