import api from '../api/mainApi'

import { call, put, takeEvery } from 'redux-saga/effects'

import { createAction } from '@reduxjs/toolkit'

// /////////////////////////////////////////////////////////////////////////////
// Action Types
// /////////////////////////////////////////////////////////////////////////////

export const types = {
    FETCH_LATEST_CHALLENGE: 'FETCH_LATEST_CHALLENGE',
    FETCH_LATEST_CHALLENGE_SUCCESS: 'FETCH_LATEST_CHALLENGE_SUCCESS',

    FETCH_CHALLENGES: 'FETCH_CHALLENGES',
    FETCH_CHALLENGES_SUCCESS: 'FETCH_CHALLENGES_SUCCESS',
    FETCH_CHALLENGES_ERROR: 'FETCH_CHALLENGES_ERROR',

    FETCH_CHALLENGE: 'FETCH_CHALLENGE',
    FETCH_CHALLENGE_SUCCESS: 'FETCH_CHALLENGE_SUCCESS',
    FETCH_CHALLENGE_ERROR: 'FETCH_CHALLENGE_ERROR',
}

////////////////////////////////////////////////////////////////////////////////
// Action Creators
////////////////////////////////////////////////////////////////////////////////

export const actions = {
    fetchLatestChallenge: createAction(types.FETCH_LATEST_CHALLENGE),
    fetchChallenges: createAction(types.FETCH_CHALLENGES),
    fetchChallenge: createAction(types.FETCH_CHALLENGE),
}

////////////////////////////////////////////////////////////////////////////////
// Reducers
////////////////////////////////////////////////////////////////////////////////

export const initialState = {
    challenges: undefined,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.FETCH_LATEST_CHALLENGE_SUCCESS:
        return {
            ...state,
            challenge: {
                challengeId: action.payload.challengeId,
                startTime: action.payload.startTime,
                endTime: action.payload.endTime
            }
        }
    case types.FETCH_CHALLENGES_SUCCESS:
        return {
            ...state,
            challenges: action.payload,
        }
    case types.FETCH_CHALLENGE_SUCCESS:
        return {
            ...state,
            challenge: action.payload,
        }
    default:
      return state
  }
}


// /////////////////////////////////////////////////////////////////////////////
// Utils
// /////////////////////////////////////////////////////////////////////////////

//...

////////////////////////////////////////////////////////////////////////////////
// Sagas
////////////////////////////////////////////////////////////////////////////////

export function* fetchLatestChallenge() {
    try {
        const latestChallenges = yield call(api.fetchLatestChallenge)

        const latestChallenge = latestChallenges[0]

        yield put({ type: types.FETCH_LATEST_CHALLENGE_SUCCESS, payload: { challengeId: latestChallenge.id, startTime: latestChallenge.start_time, endTime: latestChallenge.end_time }})

    } catch(error) {
        console.error(error)
    }
}

export function* fetchChallenges() {
    try {
        const challenges = yield call(api.fetchChallenges)

        yield put({ type: types.FETCH_CHALLENGES_SUCCESS, payload: challenges })

    } catch(error) {
        console.error(error)
    }
}

export function* fetchChallenge({payload}) {
    const { id } = payload

    try {
        const challenge = yield call(api.fetchChallenge, id)

        yield put({ type: types.FETCH_CHALLENGE_SUCCESS, payload: challenge })

    } catch(error) {
        console.error(error)
    }
}

export const sagas = [
  takeEvery(types.FETCH_LATEST_CHALLENGE, fetchLatestChallenge),
  takeEvery(types.FETCH_CHALLENGES, fetchChallenges),
  takeEvery(types.FETCH_CHALLENGE, fetchChallenge),
]
