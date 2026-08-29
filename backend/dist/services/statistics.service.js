"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatistics = void 0;
const song_model_1 = require("../models/song.model");
const getStatistics = async () => {
    // total counts
    const totalCounts = await song_model_1.Song.aggregate([
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
    const songsByGenre = await song_model_1.Song.aggregate([
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $project: { _id: 0, genre: '$_id', count: 1 } },
        { $sort: { count: -1, genre: 1 } },
    ]);
    // songs by artist with album count (sorted by song count descending)
    const songsByArtist = await song_model_1.Song.aggregate([
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
    const songsByAlbum = await song_model_1.Song.aggregate([
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
    // Recently added songs (latest 10 entries)
    const recentSongs = await song_model_1.Song.find().sort({ createdAt: -1 }).limit(10).lean().exec();
    const topArtist = songsByArtist.length > 0 ? songsByArtist[0] : null;
    const topAlbum = songsByAlbum.length > 0 ? songsByAlbum[0] : null;
    const top10Artists = songsByArtist.slice(0, 10);
    const top10Albums = songsByAlbum.slice(0, 10);
    const top10Genres = songsByGenre.slice(0, 10);
    const stats = {
        totalSongs: totalCounts[0]?.totalSongs ?? 0,
        totalArtists: totalCounts[0]?.totalArtists ?? 0,
        totalAlbums: totalCounts[0]?.totalAlbums ?? 0,
        totalGenres: totalCounts[0]?.totalGenres ?? 0,
        songsByGenre,
        songsByArtist,
        songsByAlbum,
        topArtist,
        topAlbum,
        top10Artists,
        top10Albums,
        top10Genres,
        recentSongs: recentSongs,
    };
    return stats;
};
exports.getStatistics = getStatistics;
