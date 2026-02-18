import { Request, Response } from 'express';
import prisma from '../utils/prisma';
// import { UserStatus, Role } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

// Helper to map frontend role to backend enum
const mapRoleToBackend = (role: string): any => {
    switch (role) {
        case 'buyer': return 'CUSTOMER';
        case 'seller': return 'SELLER';
        case 'delivery_man': return 'DELIVERY_PARTNER';
        default: return 'CUSTOMER'; // Default fallback
    }
};

// Helper to map backend enum to frontend role
const mapRoleToFrontend = (role: any) => {
    switch (role) {
        case 'CUSTOMER': return 'buyer';
        case 'SELLER': return 'seller';
        case 'DELIVERY_PARTNER': return 'delivery_man';
        case 'ADMIN': return 'ADMIN';
        default: return 'buyer';
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password, shopName, role } = req.body;

        // Validation
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check existing user
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or phone already exists' });
        }

        // Create user
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                shopName: role === 'seller' ? shopName : null,
                role: mapRoleToBackend(role),
                status: role === 'buyer' ? 'APPROVED' : 'APPROVED' // For demo simplicity, auto-approve all
            } as any,
        });

        // Generate Token
        const token = generateToken(user.id, user.role);

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: mapRoleToFrontend(user.role) },
            token,
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        // Accept identifier (email/phone) OR email (backward compat)
        const identifier = req.body.identifier || req.body.email;
        const { password } = req.body;

        // Validation
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please provide email/phone and password' });
        }

        // Find User by Email OR Phone
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check Password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check Status
        // @ts-ignore
        const userStatus = user.status;
        if (userStatus && userStatus !== 'APPROVED') {
            return res.status(403).json({
                message: 'Your account is pending approval from the administrator.',
                status: userStatus
            });
        }

        // Generate Token
        const token = generateToken(user.id, user.role);

        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: mapRoleToFrontend(user.role) },
            token,
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
