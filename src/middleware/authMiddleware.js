"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, 'your_secret_key');
        req.user = (await userModel_1.default.findById(decoded.id).select('-password'));
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.authMiddleware = authMiddleware;
