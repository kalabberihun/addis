import { Request, Response, NextFunction } from 'express';
import * as songService from '../services/song.service';
import { createSongSchema, updateSongSchema } from '../validators/song.validator';

// Create a new song
export const createSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createSongSchema.parse(req.body);
    const song = await songService.createSong(validated);
    res.status(201).json(song);
  } catch (err) {
    next(err);
  }
};

// Get all songs (optionally filter by genre)
export const getSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genre = req.query.genre as string | undefined;
    const songs = await songService.getAllSongs({ genre });
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

// Get a song by ID
export const getSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song = await songService.getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    next(err);
  }
};

// Update a song
export const updateSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = updateSongSchema.parse(req.body);
    const updated = await songService.updateSong(req.params.id, validated);
    if (!updated) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete a song
export const deleteSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await songService.deleteSong(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
