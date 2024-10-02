import { Request, Response, NextFunction } from 'express';
import { IUser} from '../models/userModel';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.userJWT
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded: any = jwt.verify(token, 'your_secret_key');
        req.user = (await User.findById(decoded.id).select('-password')) as IUser;

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next(); 
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};
