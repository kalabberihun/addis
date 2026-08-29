"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSong = exports.updateSong = exports.getSong = exports.getSongs = exports.createSong = void 0;
const songService = __importStar(require("../services/song.service"));
const song_validator_1 = require("../validators/song.validator");
// Create a new song
const createSong = async (req, res, next) => {
    try {
        const validated = song_validator_1.createSongSchema.parse(req.body);
        const song = await songService.createSong(validated);
        res.status(201).json(song);
    }
    catch (err) {
        next(err);
    }
};
exports.createSong = createSong;
// Get all songs (optionally filter by genre)
const getSongs = async (req, res, next) => {
    try {
        const genre = req.query.genre;
        const songs = await songService.getAllSongs({ genre });
        res.json(songs);
    }
    catch (err) {
        next(err);
    }
};
exports.getSongs = getSongs;
// Get a song by ID
const getSong = async (req, res, next) => {
    try {
        const song = await songService.getSongById(req.params.id);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.json(song);
    }
    catch (err) {
        next(err);
    }
};
exports.getSong = getSong;
// Update a song
const updateSong = async (req, res, next) => {
    try {
        const validated = song_validator_1.updateSongSchema.parse(req.body);
        const updated = await songService.updateSong(req.params.id, validated);
        if (!updated) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
};
exports.updateSong = updateSong;
// Delete a song
const deleteSong = async (req, res, next) => {
    try {
        const deleted = await songService.deleteSong(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteSong = deleteSong;
