import { Schema, model, Document } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}

const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const SongSchema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Pre‑save hook to normalize artist and genre to Title Case
SongSchema.pre('save', async function () {
  if (this.isModified('artist')) {
    this.artist = toTitleCase(this.artist);
  }
  if (this.isModified('genre')) {
    this.genre = toTitleCase(this.genre);
  }
});

export const Song = model<ISong>('Song', SongSchema);
