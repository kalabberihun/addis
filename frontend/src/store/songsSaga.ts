import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  getSongsApi,
  createSongApi,
  updateSongApi,
  deleteSongApi,
  getStatisticsApi,
} from '../api/songApi';
import { Song, SongInput, StatisticsResult } from '../types';
import {
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
} from './songsSlice';
import { RootState } from './index';

// Worker Saga: Fetch Songs
function* handleFetchSongs(action: PayloadAction<string | undefined>): Generator<any, void, any> {
  try {
    const genre: string | undefined = action.payload;
    const songs: Song[] = yield call(getSongsApi, genre);
    yield put(fetchSongsSuccess(songs));
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || error.message || 'Failed to fetch songs';
    yield put(fetchSongsFailure(errorMsg));
  }
}

// Worker Saga: Fetch Statistics
function* handleFetchStatistics(): Generator<any, void, any> {
  try {
    const stats: StatisticsResult = yield call(getStatisticsApi);
    yield put(fetchStatisticsSuccess(stats));
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || error.message || 'Failed to fetch statistics';
    yield put(fetchStatisticsFailure(errorMsg));
  }
}

// Worker Saga: Create Song
function* handleCreateSong(
  action: PayloadAction<{ data: SongInput; callback?: () => void }>
): Generator<any, void, any> {
  try {
    const newSong: Song = yield call(createSongApi, action.payload.data);
    yield put(createSongSuccess(newSong));
    
    // Refresh statistics immediately
    yield put(fetchStatisticsRequest());

    // Refresh song list respecting current genre filter
    const currentGenre: string = yield select((state: RootState) => state.songs.selectedGenre);
    yield put(fetchSongsRequest(currentGenre !== 'All' ? currentGenre : undefined));

    if (action.payload.callback) {
      action.payload.callback();
    }
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'Failed to create song';
    yield put(createSongFailure(errorMsg));
  }
}

// Worker Saga: Update Song
function* handleUpdateSong(
  action: PayloadAction<{ id: string; data: Partial<SongInput>; callback?: () => void }>
): Generator<any, void, any> {
  try {
    const updatedSong: Song = yield call(
      updateSongApi,
      action.payload.id,
      action.payload.data
    );
    yield put(updateSongSuccess(updatedSong));

    // Refresh statistics immediately
    yield put(fetchStatisticsRequest());

    // Refresh songs list
    const currentGenre: string = yield select((state: RootState) => state.songs.selectedGenre);
    yield put(fetchSongsRequest(currentGenre !== 'All' ? currentGenre : undefined));

    if (action.payload.callback) {
      action.payload.callback();
    }
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'Failed to update song';
    yield put(updateSongFailure(errorMsg));
  }
}

// Worker Saga: Delete Song
function* handleDeleteSong(
  action: PayloadAction<{ id: string; title: string; callback?: () => void }>
): Generator<any, void, any> {
  try {
    yield call(deleteSongApi, action.payload.id);
    yield put(deleteSongSuccess({ id: action.payload.id, title: action.payload.title }));

    // Refresh statistics immediately
    yield put(fetchStatisticsRequest());

    // Refresh songs list
    const currentGenre: string = yield select((state: RootState) => state.songs.selectedGenre);
    yield put(fetchSongsRequest(currentGenre !== 'All' ? currentGenre : undefined));

    if (action.payload.callback) {
      action.payload.callback();
    }
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || error.message || 'Failed to delete song';
    yield put(deleteSongFailure(errorMsg));
  }
}

// Watcher Saga
export function* songsSaga() {
  yield takeLatest(fetchSongsRequest.type, handleFetchSongs);
  yield takeLatest(fetchStatisticsRequest.type, handleFetchStatistics);
  yield takeLatest(createSongRequest.type, handleCreateSong);
  yield takeLatest(updateSongRequest.type, handleUpdateSong);
  yield takeLatest(deleteSongRequest.type, handleDeleteSong);
}
