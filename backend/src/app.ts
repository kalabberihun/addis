import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import songRouter from './routes/song.routes';
import statsRouter from './routes/statistics.routes';
import { errorHandler, AppError } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/songs', songRouter);
app.use('/api/statistics', statsRouter);

// 404 handler for unmatched routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Not Found', 404));
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
