"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSongSchema = exports.createSongSchema = void 0;
const zod_1 = require("zod");
exports.createSongSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: 'Title is required' }).trim(),
    artist: zod_1.z.string().min(1, { message: 'Artist is required' }).trim(),
    album: zod_1.z.string().min(1, { message: 'Album is required' }).trim(),
    genre: zod_1.z.string().min(1, { message: 'Genre is required' }).trim(),
});
exports.updateSongSchema = zod_1.z.object({
    title: zod_1.z.string().trim().optional(),
    artist: zod_1.z.string().trim().optional(),
    album: zod_1.z.string().trim().optional(),
    genre: zod_1.z.string().trim().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field must be provided' });
