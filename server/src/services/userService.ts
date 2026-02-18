import prisma from '../utils/prisma';
import { User, Address } from '@prisma/client';

export const userService = {
    // Get user profile
    async getProfile(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            include: { addresses: true }
        });
    },

    // Update profile
    async updateProfile(userId: string, data: Partial<User>) {
        return prisma.user.update({
            where: { id: userId },
            data
        });
    },

    // Add Address
    async addAddress(userId: string, data: Omit<Address, 'id' | 'userId'>) {
        // If set as default, unset others
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false }
            });
        }

        return prisma.address.create({
            data: {
                ...data,
                userId
            }
        });
    },

    // Get Addresses
    async getAddresses(userId: string) {
        return prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' }
        });
    },


    // Delete Address
    async deleteAddress(userId: string, addressId: string) {
        // Verify ownership
        const address = await prisma.address.findUnique({
            where: { id: addressId }
        });

        if (!address || address.userId !== userId) {
            throw new Error('Address not found or unauthorized');
        }

        return prisma.address.delete({
            where: { id: addressId }
        });
    },

    // Update Address
    async updateAddress(userId: string, addressId: string, data: Partial<Address>) {
        // Verify ownership
        const address = await prisma.address.findUnique({
            where: { id: addressId }
        });

        if (!address || address.userId !== userId) {
            throw new Error('Address not found or unauthorized');
        }

        // If setting as default, unset others
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { userId, id: { not: addressId } },
                data: { isDefault: false }
            });
        }

        return prisma.address.update({
            where: { id: addressId },
            data
        });
    }
};
