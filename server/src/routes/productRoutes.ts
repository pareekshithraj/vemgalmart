import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController';
import { authMiddleware, authorizeRole } from '../middleware/auth';

const router = Router();

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected Routes (Sellers and Admins only)
router.post('/',
    authMiddleware,
    authorizeRole(['SELLER', 'ADMIN']),
    createProduct
);

router.put('/:id',
    authMiddleware,
    authorizeRole(['SELLER', 'ADMIN']),
    updateProduct
);

router.delete('/:id',
    authMiddleware,
    authorizeRole(['SELLER', 'ADMIN']),
    deleteProduct
);

export default router;
