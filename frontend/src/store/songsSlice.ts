import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song, SongInput, StatisticsResult } from '../types';

export interface SongsState {
  songs: Song[];
  selectedSong: Song | null;
  statistics: StatisticsResult | null;
  loading: boolean;
  statsLoading: boolean;
  submitting: boolean;
  error: string | null;
  successMessage: string | null;
  selectedGenre: string;
  searchQuery: string;
  isFormModalOpen: boolean;
  formMode: 'create' | 'edit';
  deletingSongId: string | null;
}

const initialState: SongsState = {
  songs: [],
  selectedSong: null,
  statistics: null,
  loading: false,
  statsLoading: false,
  submitting: false,
  error: null,
  successMessage: null,
  selectedGenre: 'All',
  searchQuery: '',
  isFormModalOpen: false,
  formMode: 'create',
  deletingSongId: null,
};

export const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    // Fetch Songs Actions
    fetchSongsRequest(state, _action: PayloadAction<string | undefined>) {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess(state, action: PayloadAction<Song[]>) {
      state.songs = action.payload;
      state.loading = false;
    },
    fetchSongsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // Fetch Statistics Actions
    fetchStatisticsRequest(state) {
      state.statsLoading = true;
    },
    fetchStatisticsSuccess(state, action: PayloadAction<StatisticsResult>) {
      state.statistics = action.payload;
      state.statsLoading = false;
    },
    fetchStatisticsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.statsLoading = false;
    },

    // Create Song Actions
    createSongRequest(
      state,
      _action: PayloadAction<{ data: SongInput; callback?: () => void }>
    ) {
      state.submitting = true;
      state.error = null;
      state.successMessage = null;
    },
    createSongSuccess(state, action: PayloadAction<Song>) {
      state.songs.unshift(action.payload);
      state.submitting = false;
      state.isFormModalOpen = false;
      state.successMessage = `Song "${action.payload.title}" was added successfully!`;
    },
    createSongFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.submitting = false;
    },

    // Update Song Actions
    updateSongRequest(
      state,
      _action: PayloadAction<{ id: string; data: Partial<SongInput>; callback?: () => void }>
    ) {
      state.submitting = true;
      state.error = null;
      state.successMessage = null;
    },
    updateSongSuccess(state, action: PayloadAction<Song>) {
      const index = state.songs.findIndex((s) => s._id === action.payload._id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
      state.submitting = false;
      state.isFormModalOpen = false;
      state.selectedSong = null;
      state.successMessage = `Song "${action.payload.title}" updated successfully!`;
    },
    updateSongFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.submitting = false;
    },

    // Delete Song Actions
    deleteSongRequest(
      state,
      _action: PayloadAction<{ id: string; title: string; callback?: () => void }>
    ) {
      state.submitting = true;
      state.error = null;
      state.successMessage = null;
    },
    deleteSongSuccess(state, action: PayloadAction<{ id: string; title: string }>) {
      state.songs = state.songs.filter((s) => s._id !== action.payload.id);
      state.submitting = false;
      state.deletingSongId = null;
      state.successMessage = `Song "${action.payload.title}" was deleted.`;
    },
    deleteSongFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.submitting = false;
    },

    // UI State Reducers
    setSelectedGenre(state, action: PayloadAction<string>) {
      state.selectedGenre = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    openCreateModal(state) {
      state.selectedSong = null;
      state.formMode = 'create';
      state.isFormModalOpen = true;
      state.error = null;
    },
    openEditModal(state, action: PayloadAction<Song>) {
      state.selectedSong = action.payload;
      state.formMode = 'edit';
      state.isFormModalOpen = true;
      state.error = null;
    },
    closeFormModal(state) {
      state.isFormModalOpen = false;
      state.selectedSong = null;
      state.error = null;
    },
    setDeletingSongId(state, action: PayloadAction<string | null>) {
      state.deletingSongId = action.payload;
    },
    clearNotification(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  fetchStatisticsRequest,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
  createSongRequest,
  createSongSuccess,
  createSongFailure,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailure,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailure,
  setSelectedGenre,
  setSearchQuery,
  openCreateModal,
  openEditModal,
  closeFormModal,
  setDeletingSongId,
  clearNotification,
} = songsSlice.actions;

export default songsSlice.reducer;
