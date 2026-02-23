import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../utils/prisma';

// Express Request type extended in src/types/custom.d.ts

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === 'string') {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Verify user exists in DB (optional but safer)
    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true }
    });

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = { id: user.id, role: user.role };
    next();
};

export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
