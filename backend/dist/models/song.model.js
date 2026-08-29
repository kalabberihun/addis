"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = exports.toTitleCase = void 0;
const mongoose_1 = require("mongoose");
const toTitleCase = (str) => {
    if (!str)
        return str;
    return str
        .trim()
        .split(/\s+/)
        .map((word) => {
        if (word.includes('-')) {
            return word
                .split('-')
                .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : ''))
                .join('-');
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
        .join(' ');
};
exports.toTitleCase = toTitleCase;
const SongSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
}, { timestamps: true });
// Pre-save hook to normalize title, artist, album, and genre regardless of casing
SongSchema.pre('save', async function () {
    if (this.isModified('title') && this.title) {
        this.title = (0, exports.toTitleCase)(this.title);
    }
    if (this.isModified('artist') && this.artist) {
        this.artist = (0, exports.toTitleCase)(this.artist);
    }
    if (this.isModified('album') && this.album) {
        this.album = (0, exports.toTitleCase)(this.album);
    }
    if (this.isModified('genre') && this.genre) {
        this.genre = (0, exports.toTitleCase)(this.genre);
    }
});
exports.Song = (0, mongoose_1.model)('Song', SongSchema);
