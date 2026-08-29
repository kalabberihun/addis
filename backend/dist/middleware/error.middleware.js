"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Global error handling middleware
const errorHandler = (err, _req, res, _next) => {
    let error = err;
    if (!error.statusCode) {
        // Unexpected errors – treat as 500
        error = new AppError('Internal Server Error', 500);
        console.error('Unexpected error:', err);
    }
    res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
    });
};
exports.errorHandler = errorHandler;
