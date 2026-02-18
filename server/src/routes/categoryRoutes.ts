import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authMiddleware, authorizeRole } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getCategories);

// Admin Only
router.post('/', authMiddleware, authorizeRole(['ADMIN']), createCategory);
router.put('/:id', authMiddleware, authorizeRole(['ADMIN']), updateCategory);
router.delete('/:id', authMiddleware, authorizeRole(['ADMIN']), deleteCategory);

export default router;
