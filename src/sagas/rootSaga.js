import { all } from 'redux-saga/effects'

import { sagas as boardsSagas } from '../ducks/boards'

export default function* rootSaga() {
  yield all([
    ...boardsSagas,
  ])
}
