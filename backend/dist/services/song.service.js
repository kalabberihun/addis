"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSong = exports.updateSong = exports.getSongById = exports.getAllSongs = exports.createSong = void 0;
const song_model_1 = require("../models/song.model");
const mongoose_1 = require("mongoose");
const createSong = async (data) => {
    const normalizedData = {
        title: (0, song_model_1.toTitleCase)(data.title),
        artist: (0, song_model_1.toTitleCase)(data.artist),
        album: (0, song_model_1.toTitleCase)(data.album),
        genre: (0, song_model_1.toTitleCase)(data.genre),
    };
    const song = new song_model_1.Song(normalizedData);
    return await song.save();
};
exports.createSong = createSong;
const getAllSongs = async (filter) => {
    const query = {};
    if (filter.genre) {
        // Case-insensitive regex match (e.g. 'pop', 'POP', 'Pop' all match)
        query.genre = { $regex: new RegExp(`^${filter.genre.trim()}$`, 'i') };
    }
    return await song_model_1.Song.find(query).sort({ createdAt: -1 }).exec();
};
exports.getAllSongs = getAllSongs;
const getSongById = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return null;
    }
    return await song_model_1.Song.findById(id).exec();
};
exports.getSongById = getSongById;
const updateSong = async (id, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return null;
    }
    const updatePayload = { ...data };
    if (updatePayload.title)
        updatePayload.title = (0, song_model_1.toTitleCase)(updatePayload.title);
    if (updatePayload.artist)
        updatePayload.artist = (0, song_model_1.toTitleCase)(updatePayload.artist);
    if (updatePayload.album)
        updatePayload.album = (0, song_model_1.toTitleCase)(updatePayload.album);
    if (updatePayload.genre)
        updatePayload.genre = (0, song_model_1.toTitleCase)(updatePayload.genre);
    return await song_model_1.Song.findByIdAndUpdate(id, updatePayload, {
        returnDocument: 'after',
        runValidators: true,
    }).exec();
};
exports.updateSong = updateSong;
const deleteSong = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return null;
    }
    return await song_model_1.Song.findByIdAndDelete(id).exec();
};
exports.deleteSong = deleteSong;
