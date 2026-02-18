import express from 'express';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/', upload.array('images', 5), (req, res) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls = files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
        message: 'Images uploaded successfully',
        imageUrls
    });
});

export default router;
