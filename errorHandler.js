const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
    }
}

const errorHandler = (err, req, res, next) => {
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
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = {
    errorHandler,
    logger,
    ValidationError,
    DatabaseError
};