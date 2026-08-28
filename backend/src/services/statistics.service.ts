import { Song } from '../models/song.model';
import { PipelineStage } from 'mongoose';

export interface StatisticsResult {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  songsByGenre: { genre: string; count: number }[];
  songsByArtist: { artist: string; songCount: number; albumCount: number }[];
  songsByAlbum: { album: string; artist: string; songCount: number }[];
}

export const getStatistics = async (): Promise<StatisticsResult> => {
  // total counts
  const totalCounts = await Song.aggregate([
    {
      $group: {
        _id: null,
        totalSongs: { $sum: 1 },
        totalArtists: { $addToSet: '$artist' },
        totalAlbums: { $addToSet: '$album' },
        totalGenres: { $addToSet: '$genre' },
      },
    },
    {
      $project: {
        _id: 0,
        totalSongs: 1,
        totalArtists: { $size: '$totalArtists' },
        totalAlbums: { $size: '$totalAlbums' },
        totalGenres: { $size: '$totalGenres' },
      },
    },
  ]);

  // songs by genre
  const songsByGenre = await Song.aggregate([
    { $group: { _id: '$genre', count: { $sum: 1 } } },
    { $project: { _id: 0, genre: '$_id', count: 1 } },
    { $sort: { genre: 1 } },
  ]);

  // songs by artist with album count
  const songsByArtist = await Song.aggregate([
    {
      $group: {
        _id: '$artist',
        songCount: { $sum: 1 },
        albums: { $addToSet: '$album' },
      },
    },
    {
      $project: {
        _id: 0,
        artist: '$_id',
        songCount: 1,
        albumCount: { $size: '$albums' },
      },
    },
    { $sort: { artist: 1 } },
  ]);

  // songs by album with artist reference
  const songsByAlbum = await Song.aggregate([
    { $group: { _id: { album: '$album', artist: '$artist' }, songCount: { $sum: 1 } } },
    {
      $project: {
        _id: 0,
        album: '$_id.album',
        artist: '$_id.artist',
        songCount: 1,
      },
    },
    { $sort: { album: 1 } },
  ]);

  const stats: StatisticsResult = {
    totalSongs: totalCounts[0]?.totalSongs ?? 0,
    totalArtists: totalCounts[0]?.totalArtists ?? 0,
    totalAlbums: totalCounts[0]?.totalAlbums ?? 0,
    totalGenres: totalCounts[0]?.totalGenres ?? 0,
    songsByGenre,
    songsByArtist,
    songsByAlbum,
  };

  return stats;
};
