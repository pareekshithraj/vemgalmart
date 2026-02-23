import prisma from '../utils/prisma';
import { validateCouponLogic } from '../controllers/couponController';


export const orderService = {
    async createOrder(userId: string, deliveryAddress: string, items: { productId: string; quantity: number }[], couponCode?: string) {
        if (!items || items.length === 0) {
            throw new Error('Order must contain at least one item');
        }

        // 1. Fetch products to get current prices and validate existence
        const productIds = items.map(i => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        // Map for quick lookup
        const productMap = new Map(products.map(p => [p.id, p]));

        // 2. Calculate total and prepare order items
        let totalAmount = 0;
        const orderItemsData: { productId: string; quantity: number; priceAtPurchase: number }[] = [];

        for (const item of items) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            // Check inventory (optional, skipping for now as per plan)

            totalAmount += product.price * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });
        }

        // Add fixed delivery/platform fees (hardcoded in frontend as 40 + 5)
        // ideally these should be config based
        totalAmount += 45;

        let finalDiscountAmount = 0;
        let appliedCouponCode: string | null = null;

        if (couponCode) {
            const validation = await validateCouponLogic(couponCode, totalAmount);
            if (!validation.valid) {
                throw new Error(validation.message || 'Invalid coupon');
            }
            finalDiscountAmount = validation.discountAmount || 0;
            appliedCouponCode = couponCode.toUpperCase();
            totalAmount -= finalDiscountAmount;

            // Cannot have negative total
            if (totalAmount < 0) totalAmount = 0;
        }

        // 3. Create order and order items in a transaction
        return prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    deliveryAddress,
                    couponCode: appliedCouponCode,
                    discountAmount: finalDiscountAmount,
                    status: 'PENDING',
                    items: {
                        create: orderItemsData
                    }
                },
                include: {
                    items: {
                        include: { product: true }
                    }
                }
            });

            if (appliedCouponCode) {
                await tx.coupon.update({
                    where: { code: appliedCouponCode },
                    data: { usedCount: { increment: 1 } }
                });
            }

            return order;
        });
    },

    async getOrders(userId: string) {
        return prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    async getOrderById(orderId: string) {
        return prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: { name: true, email: true }
                }
            }
        });
    },

    async updateOrderStatus(orderId: string, status: import('@prisma/client').OrderStatus, proofOfDeliveryImage?: string) {
        return prisma.order.update({
            where: { id: orderId },
            data: {
                status,
                ...(proofOfDeliveryImage && { proofOfDeliveryImage })
            }
        });
    },

    async getSellerOrders(sellerId: string) {
        // Find orders where at least one item belongs to this seller
        return prisma.order.findMany({
            where: {
                items: {
                    some: {
                        product: {
                            sellerId: sellerId
                        }
                    }
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: { name: true, phone: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    async getDeliveryOrders(deliveryManId: string) {
        return prisma.order.findMany({
            where: {
                OR: [
                    { status: 'READY_FOR_PICKUP', deliveryManId: null }, // Available pool
                    { deliveryManId: deliveryManId } // Assigned to me
                ]
            },
            include: {
                items: {
                    include: { product: true }
                },
                user: {
                    select: { name: true, phone: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    async assignDeliveryMan(orderId: string, deliveryManId: string) {
        return prisma.order.update({
            where: { id: orderId },
            data: {
                deliveryManId,
                status: 'PREPARING' // Or stay READY_FOR_PICKUP until picked up?
                // Let's assume assigning means they are on it.
                // Actually, if it was READY_FOR_PICKUP, it stays that way until PICKED_UP
            }
        });
    }
};
