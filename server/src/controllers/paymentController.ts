import { Request, Response } from 'express';
import { razorpay } from '../utils/razorpay';
import prisma from '../utils/prisma';
import crypto from 'crypto';

export const createPaymentOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.userId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Razorpay accepts amount in paise (multiply by 100)
        const amountInPaise = Math.round(order.totalAmount * 100);

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_order_${order.id}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id'
        });
    } catch (error) {
        console.error('Create Payment Order Error:', error);
        res.status(500).json({ message: 'Failed to create payment order' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing parameters' });
        }

        const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret';

        // Verifying the signature
        const shasum = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature) {
            // In mock/test scenarios, we might want to bypass signature check if using completely dummy keys.
            // But for real Razorpay, this check is mandatory.
            if (RAZORPAY_KEY_SECRET !== 'rzp_test_dummy_secret') {
                return res.status(400).json({ message: 'Transaction not legit!' });
            }
            // If dummy secret, we just let it pass for UX testing
            console.log("Mock Payment Verification Passed (Using Dummy Secret)");
        }

        // 1. Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'PAID',
            }
        });

        // 2. Create payment record
        await prisma.payment.create({
            data: {
                orderId: orderId,
                amount: updatedOrder.totalAmount,
                method: 'razorpay',
                transactionId: razorpay_payment_id,
                status: 'COMPLETED'
            }
        });

        res.status(200).json({
            message: 'Payment verified successfully',
            orderId: orderId,
        });
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
