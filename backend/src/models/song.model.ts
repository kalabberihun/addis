import { Schema, model, Document } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toTitleCase = (str: string): string => {
  if (!str) return str;
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

const SongSchema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Pre-save hook to normalize title, artist, album, and genre regardless of casing
SongSchema.pre('save', async function () {
  if (this.isModified('title') && this.title) {
    this.title = toTitleCase(this.title);
  }
  if (this.isModified('artist') && this.artist) {
    this.artist = toTitleCase(this.artist);
  }
  if (this.isModified('album') && this.album) {
    this.album = toTitleCase(this.album);
  }
  if (this.isModified('genre') && this.genre) {
    this.genre = toTitleCase(this.genre);
  }
});

export const Song = model<ISong>('Song', SongSchema);
