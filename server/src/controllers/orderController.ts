import { Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { sendEmail, sendSMS, sendPushNotification } from '../services/notificationService';
import prisma from '../utils/prisma';

export const createOrder = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { deliveryAddress, items, couponCode } = req.body;

        if (!deliveryAddress) {
            return res.status(400).json({ message: 'Delivery address is required' });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items are required' });
        }

        const order = await orderService.createOrder(req.user.id, deliveryAddress, items, couponCode);

        // Send Notification
        sendEmail(
            req.user.email || '',
            `Order Confirmation - Vemgal Mart #${order.id.slice(0, 8)}`,
            `Hi ${req.user.name || 'Customer'},\n\nYour order has been placed successfully!\nOrder ID: ${order.id}\nTotal: ₹${order.totalAmount}\nDelivery Address: ${deliveryAddress}\n\nThank you for shopping with us!`
        );

        if (req.user.phone) {
            sendSMS(req.user.phone, `Vemgal Mart: Your order #${order.id.slice(0, 8)} of ₹${order.totalAmount} is confirmed. Track it on the app!`);
        }

        // Fetch user from DB to check for fcmToken
        const orderUser = await prisma.user.findUnique({ where: { id: req.user.id }, select: { fcmToken: true } });
        if (orderUser?.fcmToken) {
            sendPushNotification(
                orderUser.fcmToken,
                'Order Confirmed! 🎉',
                `Your order #${order.id.slice(0, 8)} has been placed successfully.`,
                { orderId: order.id }
            );
        }

        // Emit Socket Event
        const io = req.app.get('io');
        io.emit('new_order', order);

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Create Order Error:', error);
        const message = error instanceof Error ? error.message : 'Error creating order';
        res.status(400).json({ message });
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        let orders;
        if (req.user.role === 'SELLER') {
            orders = await orderService.getSellerOrders(req.user.id);
        } else if (req.user.role === 'DELIVERY_PARTNER') {
            orders = await orderService.getDeliveryOrders(req.user.id);
        } else {
            // Default to buyer
            orders = await orderService.getOrders(req.user.id);
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error('Get My Orders Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrderDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderById(id as string);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check permission
        // Buyers can see their own
        // Sellers can see if they have items in it (simplified check for now: allow if role is seller)
        // Delivery can see if assigned or available
        // Admin can see all

        // Strict check for buyers
        if (req.user?.role === 'CUSTOMER' && order.userId !== req.user?.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Get Order Details Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, proofOfDeliveryImage } = req.body;
        const order = await orderService.updateOrderStatus(id as string, status, proofOfDeliveryImage);

        const orderWithUser = await prisma.order.findUnique({
            where: { id: id as string },
            include: { user: { select: { name: true, phone: true, email: true, fcmToken: true } } }
        });

        if (orderWithUser && orderWithUser.user) {
            const { name, phone, email, fcmToken } = orderWithUser.user;
            let message = `Hi ${name}, your order #${id.slice(0, 8)} status is now: ${status.replace(/_/g, ' ')}.`;

            if (status === 'OUT_FOR_DELIVERY') {
                message = `Great news ${name}! Your Vemgal Mart order #${id.slice(0, 8)} is OUT FOR DELIVERY. Our partner will bring it shortly.`;
            } else if (status === 'DELIVERED') {
                message = `Yay! Your Vemgal Mart order #${id.slice(0, 8)} has been DELIVERED successfully. Enjoy!`;
            }

            // Send Notifications
            sendEmail(email, `Order Status Update: ${status.replace(/_/g, ' ')}`, message);
            if (phone) {
                sendSMS(phone, message);
            }

            if (orderWithUser.user.fcmToken) {
                sendPushNotification(
                    orderWithUser.user.fcmToken,
                    'Order Update 📦',
                    message,
                    { orderId: id as string, status }
                );
            }
        }

        // Emit Socket Event
        const io = req.app.get('io');
        io.emit('order_status_updated', { orderId: id, status });

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const assignDelivery = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.user || req.user.role !== 'DELIVERY_PARTNER') {
            return res.status(403).json({ message: 'Only delivery partners can accept orders' });
        }

        const order = await orderService.assignDeliveryMan(id as string, req.user.id);

        // Emit socket event
        const io = req.app.get('io');
        io.emit('order_status_updated', { orderId: id, status: order.status, deliveryManId: req.user.id });

        res.status(200).json({ message: 'Order assigned', order });
    } catch (error) {
        console.error('Assign Delivery Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
