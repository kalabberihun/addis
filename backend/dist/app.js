"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const song_routes_1 = __importDefault(require("./routes/song.routes"));
const statistics_routes_1 = __importDefault(require("./routes/statistics.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/songs', song_routes_1.default);
app.use('/api/statistics', statistics_routes_1.default);
// 404 handler for unmatched routes
app.use((_req, _res, next) => {
    next(new error_middleware_1.AppError('Not Found', 404));
});
// Global error handler (must be last)
app.use(error_middleware_1.errorHandler);
exports.default = app;
