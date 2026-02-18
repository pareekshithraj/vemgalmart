import { Request, Response } from 'express';
import prisma from '../utils/prisma';
// import { UserStatus, Role } from '@prisma/client'; // Avoid import if causing issues

export const getPendingUsers = async (req: any, res: any) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                status: 'PENDING',
                role: { in: ['SELLER', 'DELIVERY_PARTNER'] }
            } as any,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // @ts-ignore
                status: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching pending users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUserStatus = async (req: any, res: any) => {
    try {
        const { userId } = req.params;
        const { status } = req.body; // 'APPROVED' | 'REJECTED'

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const newStatus = status; // Just use the string

        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: newStatus } as any
        });


        res.json({ message: `User ${status.toLowerCase()} successfully`, user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getDashboardStats = async (req: any, res: any) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalProducts = await prisma.product.count();
        const totalOrders = await prisma.order.count();

        // Calculate revenue (sum of totalAmount from Orders where paymentStatus is 'PAID' or status is 'DELIVERED')
        // For simplicity, just valid orders
        const revenueAgg = await prisma.order.aggregate({
            _sum: {
                totalAmount: true
            }
        });

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: revenueAgg._sum.totalAmount || 0,
            activeSellers: await prisma.user.count({ where: { role: 'SELLER', status: 'APPROVED' } as any })
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // @ts-ignore
                status: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
