import { Router } from 'express';
import * as songController from '../controllers/song.controller';

const router = Router();

router.post('/', songController.createSong);
router.get('/', songController.getSongs);
router.get('/:id', songController.getSong);
router.patch('/:id', songController.updateSong);
router.delete('/:id', songController.deleteSong);

export default router;
