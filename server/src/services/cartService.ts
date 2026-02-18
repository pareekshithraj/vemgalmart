import prisma from '../utils/prisma';

export const cartService = {
    async getCart(userId: string) {
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        }

        return cart;
    },

    async addToCart(userId: string, productId: string, quantity: number) {
        const cart = await this.getCart(userId);

        const existingItem = cart.items.find(item => item.productId === productId);

        if (existingItem) {
            return prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        }

        return prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity
            }
        });
    },

    async updateCartItem(cartItemId: string, quantity: number) {
        if (quantity <= 0) {
            return prisma.cartItem.delete({
                where: { id: cartItemId }
            });
        }

        return prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });
    },

    async removeFromCart(cartItemId: string) {
        return prisma.cartItem.delete({
            where: { id: cartItemId }
        });
    },

    async clearCart(userId: string) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            return prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }
    }
};
