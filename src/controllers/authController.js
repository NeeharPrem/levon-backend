"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const register = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new errorHandler_1.ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }
    try {
        const { name, email, password } = req.body;
        const user = await userModel_1.default.create({ name, email, password });
        res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (error) {
        return next(new errorHandler_1.DatabaseError('Error in registration: ' + error.message));
    }
};
exports.register = register;
const login = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new errorHandler_1.ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }
    try {
        const { email, password } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return next(new errorHandler_1.ValidationError('Invalid email or password'));
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('userJWT', token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'none'
        });
        res.json({ user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (error) {
        return next(new errorHandler_1.DatabaseError('Error in login: ' + error.message));
    }
};
exports.login = login;
