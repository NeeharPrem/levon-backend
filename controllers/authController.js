const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const { ValidationError, DatabaseError } = require('../errorHandler');

exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('userJWT', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        return next(new DatabaseError('Error in registration: ' + error.message));
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return next(new ValidationError('Invalid email or password'));
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('userJWT', token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'None'
        });
        res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        return next(new DatabaseError('Error in login: ' + error.message));
    }
};