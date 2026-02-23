import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

export default router;
