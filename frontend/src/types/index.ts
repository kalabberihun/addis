export interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SongInput {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export interface GenreStat {
  genre: string;
  count: number;
}

export interface ArtistStat {
  artist: string;
  songCount: number;
  albumCount: number;
}

export interface AlbumStat {
  album: string;
  artist: string;
  songCount: number;
}

export interface StatisticsResult {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  songsByGenre: GenreStat[];
  songsByArtist: ArtistStat[];
  songsByAlbum: AlbumStat[];
}

export interface SongsFilter {
  genre?: string;
  search?: string;
}
