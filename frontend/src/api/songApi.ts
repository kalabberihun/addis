import axios from 'axios';
import { Song, SongInput, StatisticsResult } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
