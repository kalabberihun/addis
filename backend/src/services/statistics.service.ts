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
  topArtist: { artist: string; songCount: number; albumCount: number } | null;
  topAlbum: { album: string; artist: string; songCount: number } | null;
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

  // songs by genre (sorted by count descending, then genre name)
  const songsByGenre = await Song.aggregate([
    { $group: { _id: '$genre', count: { $sum: 1 } } },
    { $project: { _id: 0, genre: '$_id', count: 1 } },
    { $sort: { count: -1, genre: 1 } },
  ]);

  // songs by artist with album count (sorted by song count descending)
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
    { $sort: { songCount: -1, artist: 1 } },
  ]);

  // songs by album with artist reference (sorted by track count descending)
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
    { $sort: { songCount: -1, album: 1 } },
  ]);

  const topArtist = songsByArtist.length > 0 ? songsByArtist[0] : null;
  const topAlbum = songsByAlbum.length > 0 ? songsByAlbum[0] : null;

  const stats: StatisticsResult = {
    totalSongs: totalCounts[0]?.totalSongs ?? 0,
    totalArtists: totalCounts[0]?.totalArtists ?? 0,
    totalAlbums: totalCounts[0]?.totalAlbums ?? 0,
    totalGenres: totalCounts[0]?.totalGenres ?? 0,
    songsByGenre,
    songsByArtist,
    songsByAlbum,
    topArtist,
    topAlbum,
  };

  return stats;
};
