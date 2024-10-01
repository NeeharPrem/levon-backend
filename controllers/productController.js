const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../errorHandler');

let products = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Smartphone', price: 800 },
    { id: 3, name: 'Headphones', price: 150 },
    { id: 4, name: 'Monitor', price: 300 },
    { id: 5, name: 'Keyboard', price: 100 }
];

const productValidationRules = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }
    next();
};

const findProduct = (id) => {
    return products.find((product) => product.id === parseInt(id));
};

exports.getAllProducts = (req, res) => {
    res.json(products);
};

exports.getProductById = (req, res, next) => {
    const product = findProduct(req.params.id);
    if (!product) {
        return next(new ValidationError('Product not found'));
    }
    res.json(product);
};

exports.createProduct = [
    ...productValidationRules,
    handleValidationErrors,
    (req, res) => {
        const { name, price } = req.body;
        let productId = products.length;
        const newProduct = { id: productId + 1, name, price };
        products.push(newProduct);
        const io = req.app.get('io');
        io.emit('newProduct', newProduct);
        res.status(201).json(newProduct);
    }
];

exports.updateProduct = [
    ...productValidationRules,
    handleValidationErrors,
    (req, res, next) => {
        const product = findProduct(req.params.id);
        if (!product) {
            return next(new ValidationError('Product not found'));
        }
        const { name, price } = req.body;
        product.name = name;
        product.price = price;
        res.json(product);
    }
];

exports.deleteProduct = (req, res, next) => {
    const productIndex = products.findIndex((product) => product.id === parseInt(req.params.id));
    if (productIndex === -1) {
        return next(new ValidationError('Product not found'));
    }
    products.splice(productIndex, 1);
    res.json({ message: 'Product deleted successfully' });
};

module.exports = exports;