import prisma from '../utils/prisma';

export const productService = {
    async getAllProducts() {
        return prisma.product.findMany({
            where: { isActive: true },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        shopName: true
                    }
                },
                inventory: true
            }
        });
    },

    async getProductById(id: string) {
        return prisma.product.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                inventory: true
            }
        });
    },

    async createProduct(data: any, sellerId: string) {
        return prisma.product.create({
            data: {
                ...data,
                sellerId,
                inventory: {
                    create: {
                        quantity: data.stock || 0,
                        warehouseId: 'default'
                    }
                }
            },
            include: {
                inventory: true
            }
        });
    },

    async updateProduct(id: string, data: any) {
        return prisma.product.update({
            where: { id },
            data
        });
    },

    async deleteProduct(id: string) {
        // Soft delete
        return prisma.product.update({
            where: { id },
            data: { isActive: false }
        });
    },

    async searchProducts(query: string) {
        return prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: {
                seller: {
                    select: { id: true, name: true }
                }
            }
        });
    }
};
