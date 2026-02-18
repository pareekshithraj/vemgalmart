import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await userService.getProfile(userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await userService.updateProfile(userId, req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

export const addAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const address = await userService.addAddress(userId, req.body);
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Error adding address' });
    }
};

export const getAddresses = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const addresses = await userService.getAddresses(userId);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses' });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const addressId = req.params.id;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        await userService.deleteAddress(userId, addressId as string);
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error deleting address' });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const addressId = req.params.id;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const address = await userService.updateAddress(userId, addressId as string, req.body);
        res.status(200).json({ message: 'Address updated successfully', address });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error updating address' });
    }
};
