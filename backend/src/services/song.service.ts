import { Song, ISong, toTitleCase } from '../models/song.model';
import { Types } from 'mongoose';

export type SongInput = Pick<ISong, 'title' | 'artist' | 'album' | 'genre'>;

export const createSong = async (data: SongInput): Promise<ISong> => {
  const normalizedData: SongInput = {
    title: toTitleCase(data.title),
    artist: toTitleCase(data.artist),
    album: toTitleCase(data.album),
    genre: toTitleCase(data.genre),
  };
  const song = new Song(normalizedData);
  return await song.save();
};

export const getAllSongs = async (filter: { genre?: string }): Promise<ISong[]> => {
  const query: any = {};
  if (filter.genre) {
    // Case-insensitive regex match (e.g. 'pop', 'POP', 'Pop' all match)
    query.genre = { $regex: new RegExp(`^${filter.genre.trim()}$`, 'i') };
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

  const updatePayload: Partial<ISong> = { ...data };
  if (updatePayload.title) updatePayload.title = toTitleCase(updatePayload.title);
  if (updatePayload.artist) updatePayload.artist = toTitleCase(updatePayload.artist);
  if (updatePayload.album) updatePayload.album = toTitleCase(updatePayload.album);
  if (updatePayload.genre) updatePayload.genre = toTitleCase(updatePayload.genre);

  return await Song.findByIdAndUpdate(id, updatePayload, {
    returnDocument: 'after',
    runValidators: true,
  }).exec();
};

export const deleteSong = async (id: string): Promise<ISong | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return await Song.findByIdAndDelete(id).exec();
};
