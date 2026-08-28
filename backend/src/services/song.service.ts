import { Song, ISong } from '../models/song.model';
import { Types } from 'mongoose';

export type SongInput = Pick<ISong, 'title' | 'artist' | 'album' | 'genre'>;

export const createSong = async (data: SongInput): Promise<ISong> => {
  const song = new Song(data);
  return await song.save();
};

export const getAllSongs = async (filter: { genre?: string }): Promise<ISong[]> => {
  const query: any = {};
  if (filter.genre) {
    // case‑insensitive regex match
    query.genre = { $regex: new RegExp(`^${filter.genre}$`, 'i') };
  }
  return await Song.find(query).sort({ createdAt: -1 }).exec();
};

export const getSongById = async (id: string): Promise<ISong | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return await Song.findById(id).exec();
};

export const updateSong = async (id: string, data: Partial<ISong>): Promise<ISong | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return await Song.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
};

export const deleteSong = async (id: string): Promise<ISong | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return await Song.findByIdAndDelete(id).exec();
};
