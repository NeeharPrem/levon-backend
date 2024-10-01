const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { ValidationError } = require('../errorHandler');

exports.protect = async (req, res, next) => {
    try {
        const token = req.cookies.userJWT;
        if (!token) {
            return next(new ValidationError('Not authorized, no token'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return next(new ValidationError('User not found'));
        }
        next(); 
    } catch (error) {
        next(new ValidationError('Not authorized, token failed'));
    }
};
