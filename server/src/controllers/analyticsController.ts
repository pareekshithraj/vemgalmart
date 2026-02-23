import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Get total users
        const totalUsers = await prisma.user.count({
            where: { role: 'CUSTOMER' }
        });

        // Get total revenue
        const orders = await prisma.order.findMany({
            where: {
                status: 'DELIVERED'
            }
        });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Get total active products
        const totalProducts = await prisma.product.count({
            where: { isActive: true }
        });

        // Get total pending approvals (Sellers + Delivery Partners)
        const pendingApprovals = await prisma.user.count({
            where: {
                status: 'PENDING',
                role: { in: ['SELLER', 'DELIVERY_PARTNER'] }
            }
        });

        // Generate sales data for the last 7 days for the chart
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            return d;
        }).reverse();

        const recentOrders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: last7Days[0]
                }
            }
        });

        const salesData = last7Days.map(date => {
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const dayOrders = recentOrders.filter(o =>
                o.createdAt >= date && o.createdAt < nextDate
            );

            return {
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
                orders: dayOrders.length
            };
        });

        res.json({
            metrics: {
                totalUsers,
                totalRevenue,
                totalProducts,
                pendingApprovals
            },
            salesData
        });

    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSellerAnalytics = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.role !== 'SELLER') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const sellerId = req.user.id;

        // Get total active products for this seller
        const totalProducts = await prisma.product.count({
            where: { sellerId, isActive: true }
        });

        // Get all order items that contain this seller's products
        const sellerOrderItems = await prisma.orderItem.findMany({
            where: {
                product: {
                    sellerId: sellerId
                }
            },
            include: {
                order: true,
                product: true
            }
        });

        // Aggregate revenue (only for delivered/completed orders, or all depending on business logic - assuming all non-cancelled for now)
        const validOrderItems = sellerOrderItems.filter(item => item.order.status !== 'CANCELLED');
        const totalRevenue = validOrderItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);

        // Active Orders (Orders that are not delivered or cancelled, containing seller's items)
        const activeOrdersIds = new Set(
            sellerOrderItems
                .filter(item => !['DELIVERED', 'CANCELLED'].includes(item.order.status))
                .map(item => item.orderId)
        );
        const activeOrdersCount = activeOrdersIds.size;

        // Total Unique Customers
        const uniqueCustomerIds = new Set(validOrderItems.map(item => item.order.userId));
        const totalCustomers = uniqueCustomerIds.size;

        // Top 3 Products
        const productSales = validOrderItems.reduce((acc, item) => {
            if (!acc[item.productId]) {
                acc[item.productId] = {
                    id: item.product.id,
                    name: item.product.name,
                    image: item.product.image,
                    price: item.product.price,
                    totalSales: 0,
                    revenue: 0
                };
            }
            acc[item.productId].totalSales += item.quantity;
            acc[item.productId].revenue += (item.priceAtPurchase * item.quantity);
            return acc;
        }, {} as Record<string, any>);

        const topProducts = Object.values(productSales)
            .sort((a: any, b: any) => b.totalSales - a.totalSales)
            .slice(0, 3);

        // Generate sales data for the last 7 days for the chart
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            return d;
        }).reverse();

        const recentOrders = Array.from(new Set(validOrderItems.map(item => item.order)));

        const salesData = last7Days.map(date => {
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const dayItems = validOrderItems.filter(item =>
                item.order.createdAt >= date && item.order.createdAt < nextDate
            );

            return {
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dayItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0),
                orders: new Set(dayItems.map(item => item.orderId)).size
            };
        });

        // Avg Order Value Calculation handled safely
        const avgOrderValue = totalRevenue > 0 && uniqueCustomerIds.size > 0
            ? totalRevenue / new Set(validOrderItems.map(item => item.orderId)).size
            : 0;

        res.json({
            metrics: {
                totalRevenue,
                activeOrders: activeOrdersCount,
                totalCustomers,
                avgOrderValue
            },
            salesData,
            topProducts
        });

    } catch (error) {
        console.error('Seller Analytics Fetch Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};