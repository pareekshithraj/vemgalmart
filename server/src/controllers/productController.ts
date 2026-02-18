import { Request, Response } from 'express';
import { productService } from '../services/productService';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        let products;
        if (search) {
            products = await productService.searchProducts(search as string);
        } else {
            products = await productService.getAllProducts();
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Get All Products Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await productService.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Get Product By Id Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { name, description, price, category, image, images, stock, originalPrice, brand } = req.body;

        const productData = {
            name,
            description,
            price: parseFloat(price),
            category,
            image: image || (images && images.length > 0 ? images[0] : ''), // Fallback for backward compatibility
            images: images || (image ? [image] : []),
            stock: parseInt(stock) || 0,
            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
            brand
        };

        const product = await productService.createProduct(productData, req.user.id);
        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, description, price, category, image, images, stock, originalPrice, brand, isActive } = req.body;

        const productData: any = {
            name,
            description,
            price: price ? parseFloat(price) : undefined,
            category,
            brand,
            isActive
        };

        if (stock !== undefined) productData.stock = parseInt(stock);
        if (originalPrice !== undefined) productData.originalPrice = parseFloat(originalPrice);
        if (images) {
            productData.images = images;
            productData.image = images.length > 0 ? images[0] : (image || '');
        } else if (image) {
            productData.image = image;
            // Don't overwrite images array if only single image passed, or maybe sync them? 
            // Better to assume frontend sends 'images' array for updates if it supports it.
        }

        // Remove undefined keys
        Object.keys(productData).forEach(key => productData[key] === undefined && delete productData[key]);

        const product = await productService.updateProduct(id, productData);
        res.status(200).json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await productService.deleteProduct(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
