import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: any, res: any, next: any) => {
    // @ts-ignore
    if ((req.user as any)?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};
