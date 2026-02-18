import { Router } from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderDetails,
    updateStatus,
    assignDelivery
} from '../controllers/orderController';
import { authMiddleware, authorizeRole } from '../middleware/auth';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderDetails);

// Admin / Delivery Partner only
router.put('/:id/status',
    authorizeRole(['ADMIN', 'DELIVERY_PARTNER']),
    updateStatus
);

router.put('/:id/assign',
    authorizeRole(['DELIVERY_PARTNER']),
    assignDelivery
);

export default router;
