import { all, fork } from 'redux-saga/effects';
import { songsSaga } from './songsSaga';

export default function* rootSaga() {
  yield all([fork(songsSaga)]);
}
