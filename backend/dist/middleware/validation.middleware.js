"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateBody = void 0;
const error_middleware_1 = require("./error.middleware");
/**
 * Factory that returns an Express middleware validating `req.body` against a Zod schema.
 * If validation fails, an `AppError` with status 400 is passed to the next error handler.
 */
const validateBody = (schema) => {
    return (req, _res, next) => {
        try {
            // Zod throws on parse failures – we catch to forward a proper error.
            schema.parse(req.body);
            next();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Invalid request body';
            next(new error_middleware_1.AppError(message, 400));
        }
    };
};
exports.validateBody = validateBody;
// Similar helper for query params, if needed later.
const validateQuery = (schema) => {
    return (req, _res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Invalid query parameters';
            next(new error_middleware_1.AppError(message, 400));
        }
    };
};
exports.validateQuery = validateQuery;
