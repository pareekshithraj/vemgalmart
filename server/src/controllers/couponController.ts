import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Helper to check if a coupon is valid
const validateCouponLogic = async (code: string, cartTotal: number) => {
    const coupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() }
    });

    if (!coupon) {
        return { valid: false, message: 'Invalid coupon code' };
    }

    if (!coupon.isActive) {
        return { valid: false, message: 'Coupon is no longer active' };
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
        return { valid: false, message: 'Coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, message: 'Coupon usage limit reached' };
    }

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
        return { valid: false, message: `Minimum order value of ₹${coupon.minOrderValue} required` };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'FIXED') {
        discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return { valid: true, discountAmount, coupon };
};

export const createCoupon = async (req: Request, res: Response) => {
    try {
        const { code, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, expiryDate, isActive } = req.body;

        const existingCoupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (existingCoupon) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                discountValue,
                minOrderValue,
                maxDiscount,
                usageLimit,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        res.status(201).json({ message: 'Coupon created successfully', coupon });
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ message: 'Error creating coupon' });
    }
};

export const getCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(coupons);
    } catch (error) {
        console.error('Fetch coupons error:', error);
        res.status(500).json({ message: 'Error fetching coupons' });
    }
};

export const updateCoupon = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { discountType, discountValue, minOrderValue, maxDiscount, usageLimit, expiryDate, isActive } = req.body;
        const code = req.body.code as string | undefined;

        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                code: code ? code.toUpperCase() : undefined,
                discountType,
                discountValue,
                minOrderValue,
                maxDiscount,
                usageLimit,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                isActive
            }
        });

        res.json({ message: 'Coupon updated successfully', coupon });
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ message: 'Error updating coupon' });
    }
};

export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.coupon.delete({
            where: { id }
        });
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ message: 'Error deleting coupon' });
    }
};

export const validateCoupon = async (req: Request, res: Response) => {
    try {
        const { code, cartTotal } = req.body;

        if (!code || typeof cartTotal !== 'number') {
            return res.status(400).json({ message: 'Code and cartTotal are required' });
        }

        const validation = await validateCouponLogic(code, cartTotal);

        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }

        res.json({
            message: 'Coupon is valid',
            discountAmount: validation.discountAmount,
            coupon: validation.coupon
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({ message: 'Error validating coupon' });
    }
};

export { validateCouponLogic };
