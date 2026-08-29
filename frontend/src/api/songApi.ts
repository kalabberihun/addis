import axios from 'axios';
import { Song, SongInput, StatisticsResult } from '../types';

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return '/api';
  }

  let cleanUrl = envUrl.trim().replace(/\/+$/, '');
  // If user entered a full URL without /api (e.g. https://backend.onrender.com), append /api
  if (cleanUrl.startsWith('http') && !cleanUrl.endsWith('/api')) {
    cleanUrl = `${cleanUrl}/api`;
  }
  return cleanUrl;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSongsApi = async (genre?: string): Promise<Song[]> => {
  const params = genre && genre !== 'All' ? { genre } : {};
  const response = await api.get<Song[]>('/songs', { params });
  return response.data;
};

export const getSongByIdApi = async (id: string): Promise<Song> => {
  const response = await api.get<Song>(`/songs/${id}`);
  return response.data;
};

export const createSongApi = async (songData: SongInput): Promise<Song> => {
  const response = await api.post<Song>('/songs', songData);
  return response.data;
};

export const updateSongApi = async (id: string, songData: Partial<SongInput>): Promise<Song> => {
  const response = await api.patch<Song>(`/songs/${id}`, songData);
  return response.data;
};

export const deleteSongApi = async (id: string): Promise<void> => {
  await api.delete(`/songs/${id}`);
};

export const getStatisticsApi = async (): Promise<StatisticsResult> => {
  const response = await api.get<StatisticsResult>('/statistics');
  return response.data;
};

export default api;
