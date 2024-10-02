import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        }),
    ],
});

class ValidationError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

class DatabaseError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
    }
}

const errorHandler = (err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.name}: ${err.message}`, {
        method: req.method,
        url: req.url,
        body: req.body,
        stack: err.stack
    });

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err instanceof ValidationError) {
        statusCode = 400;
    } else if (err instanceof DatabaseError) {
        statusCode = 500;
        message = 'Database Error';
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            stack: err.stack
        }
    });
};

export {
    errorHandler,
    logger,
    ValidationError,
    DatabaseError
};