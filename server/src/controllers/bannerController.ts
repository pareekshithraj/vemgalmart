import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getBanners = async (req: Request, res: Response) => {
    try {
        const banners = await prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching banners' });
    }
};

export const createBanner = async (req: Request, res: Response) => {
    try {
        const { title, description, imageUrl, ctaText, ctaLink, displayMode, order } = req.body;
        const banner = await prisma.banner.create({
            data: {
                title,
                description,
                imageUrl,
                ctaText,
                ctaLink,
                displayMode,
                order: order || 0
            }
        });
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: 'Error creating banner' });
    }
};

export const updateBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const banner = await prisma.banner.update({
            where: { id: String(id) },
            data
        });
        res.json(banner);
    } catch (error) {
        res.status(500).json({ message: 'Error updating banner' });
    }
};

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.banner.delete({ where: { id: String(id) } });
        res.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting banner' });
    }
};
