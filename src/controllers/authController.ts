import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { validationResult } from 'express-validator';
import { ValidationError, DatabaseError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }
    try {
        const { name, email, password } = req.body as { name: string; email: string; password: string };
        const user = await User.create({ name, email, password });
        res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        return next(new DatabaseError('Error in registration: ' + (error as Error).message));
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }
    try {
        const { email, password } = req.body as { email: string; password: string };
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return next(new ValidationError('Invalid email or password'));
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.cookie('userJWT', token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'none'
        });
        res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        return next(new DatabaseError('Error in login: ' + (error as Error).message));
    }
};