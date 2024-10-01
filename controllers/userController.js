const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { ValidationError } = require('../errorHandler');

exports.getProfile = async (req, res, next) => {
    try {
        const token = req.cookies.userJWT;
        if (!token) {
            return next(new ValidationError('No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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