"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.ValidationError = exports.logger = exports.errorHandler = void 0;
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'combined.log' }),
    ],
});
exports.logger = logger;
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
class ValidationError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}
exports.ValidationError = ValidationError;
class DatabaseError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
    }
}
exports.DatabaseError = DatabaseError;
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
    }
    else if (err instanceof DatabaseError) {
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
exports.errorHandler = errorHandler;
