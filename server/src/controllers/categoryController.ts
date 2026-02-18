import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(categories);
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, image, description } = req.body;

        if (!name || !image) {
            return res.status(400).json({ message: 'Name and image are required' });
        }

        const category = await prisma.category.create({
            data: { name, image, description }
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Create Category Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { name, image, description } = req.body;

        const category = await prisma.category.update({
            where: { id },
            data: { name, image, description }
        });

        res.json(category);
    } catch (error) {
        console.error('Update Category Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        await prisma.category.delete({ where: { id } });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete Category Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
