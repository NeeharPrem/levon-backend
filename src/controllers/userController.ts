import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { ValidationError } from '../middleware/errorHandler';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.userJWT;
        if (!token) {
            return next(new ValidationError('No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const userId = decoded.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return next(new ValidationError('User not found'));
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};