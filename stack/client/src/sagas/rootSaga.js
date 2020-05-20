import { all } from 'redux-saga/effects'

import { sagas as boardsSagas } from '../ducks/boards'
import { sagas as challengesSagas } from '../ducks/challenges'

export default function* rootSaga() {
  yield all([
    ...boardsSagas,
    ...challengesSagas,
  ])
}
