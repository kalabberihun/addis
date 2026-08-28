import { Router } from 'express';
import * as statsController from '../controllers/statistics.controller';

const router = Router();

router.get('/', statsController.getStats);

export default router;
