import { z } from 'zod';

export const createSongSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).trim(),
  artist: z.string().min(1, { message: 'Artist is required' }).trim(),
  album: z.string().min(1, { message: 'Album is required' }).trim(),
  genre: z.string().min(1, { message: 'Genre is required' }).trim(),
});

export const updateSongSchema = z.object({
  title: z.string().trim().optional(),
  artist: z.string().trim().optional(),
  album: z.string().trim().optional(),
  genre: z.string().trim().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field must be provided' });
