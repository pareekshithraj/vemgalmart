import { Router } from 'express';
import { smartSearch } from '../controllers/searchController';

const router = Router();

// /api/search/smart?q=query
router.get('/smart', smartSearch);

export default router;
