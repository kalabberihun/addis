import { Request, Response, NextFunction } from 'express';
import { getStatistics } from '../services/statistics.service';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getStatistics();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};
