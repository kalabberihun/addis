import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import songRouter from './routes/song.routes';
import statsRouter from './routes/statistics.routes';
import { errorHandler, AppError } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes (supports both /api/songs and /songs)
app.use('/api/songs', songRouter);
app.use('/songs', songRouter);

app.use('/api/statistics', statsRouter);
app.use('/statistics', statsRouter);

// Health check endpoint for Render
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler for unmatched routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Not Found', 404));
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
