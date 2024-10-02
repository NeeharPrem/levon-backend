import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ValidationError } from '../middleware/errorHandler';

interface Product {
    id: number;
    name: string;
    price: number;
}

let products: Product[] = [
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

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }
    next();
};

const findProduct = (id: string): Product | undefined => {
    return products.find((product) => product.id === parseInt(id));
};

export const getAllProducts = (req: Request, res: Response) => {
    res.json(products);
};

export const getProductById = (req: Request, res: Response, next: NextFunction) => {
    const product = findProduct(req.params.id);
    if (!product) {
        return next(new ValidationError('Product not found'));
    }
    res.json(product);
};

export const createProduct = [
    ...productValidationRules,
    handleValidationErrors,
    (req: Request, res: Response) => {
        const { name, price } = req.body as { name: string; price: number };
        let productId = products.length;
        const newProduct: Product = { id: productId + 1, name, price };
        products.push(newProduct);
        const io = req.app.get('io');
        io.emit('newProduct', newProduct);
        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct
        });
    }
];

export const updateProduct = [
    ...productValidationRules,
    handleValidationErrors,
    (req: Request, res: Response, next: NextFunction) => {
        const product = findProduct(req.params.id);
        if (!product) {
            return next(new ValidationError('Product not found'));
        }
        const { name, price } = req.body as { name: string; price: number };
        product.name = name;
        product.price = price;
        res.json({
            message: 'Product updated successfully',
            product: product
        });
    }
];

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
    const productIndex = products.findIndex((product) => product.id === parseInt(req.params.id));
    if (productIndex === -1) {
        return next(new ValidationError('Product not found'));
    }
    products.splice(productIndex, 1);
    res.json({ message: 'Product deleted successfully' });
};