"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const errorHandler_1 = require("../middleware/errorHandler");
const getProfile = async (req, res, next) => {
    try {
        const token = req.cookies.userJWT;
        if (!token) {
            return next(new errorHandler_1.ValidationError('No token provided'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await userModel_1.default.findById(userId).select('-password');
        if (!user) {
            return next(new errorHandler_1.ValidationError('User not found'));
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
