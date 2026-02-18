import { Request, Response } from 'express';
import { orderService } from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { deliveryAddress, items } = req.body;

        if (!deliveryAddress) {
            return res.status(400).json({ message: 'Delivery address is required' });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items are required' });
        }

        const order = await orderService.createOrder(req.user.id, deliveryAddress, items);

        // Emit Socket Event
        const io = req.app.get('io');
        io.emit('new_order', order);

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error: any) {
        console.error('Create Order Error:', error);
        res.status(400).json({ message: error.message || 'Error creating order' });
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
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(id as string, status);

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
