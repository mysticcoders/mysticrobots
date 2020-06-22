import api from '../api/mainApi'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { createAction } from '@reduxjs/toolkit'
import { Status } from '../constants'

// /////////////////////////////////////////////////////////////////////////////
// Action Types
// /////////////////////////////////////////////////////////////////////////////

export const types = {
    FETCH_HIGH_SCORES: 'FETCH_HIGH_SCORES',
    FETCH_HIGH_SCORES_ERROR: 'FETCH_HIGH_SCORES_ERROR',
    FETCH_HIGH_SCORES_SUCCESS: 'FETCH_HIGH_SCORES_SUCCESS',

    SUBMIT_SCORE: 'SUBMIT_SCORE',
    SUBMIT_SCORE_ERROR: 'SUBMIT_SCORE_ERROR',
    SUBMIT_SCORE_SUCCESS: 'SUBMIT_SCORE_SUCCESS',
}

////////////////////////////////////////////////////////////////////////////////
// Action Creators
////////////////////////////////////////////////////////////////////////////////

export const actions = {
    fetchHighScores: createAction(types.FETCH_HIGH_SCORES),
    submitScore: createAction(types.SUBMIT_SCORE),
}

////////////////////////////////////////////////////////////////////////////////
// Reducers
////////////////////////////////////////////////////////////////////////////////

export const initialState = {
    high_scores: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.FETCH_HIGH_SCORES_SUCCESS:
        const { high_scores } = action.payload
        return {
            ...state,
            high_scores,
        }
    case types.SUBMIT_SCORE_SUCCESS:
        return {
            ...state,
        }
    default:
      return state
  }
}


// /////////////////////////////////////////////////////////////////////////////
// Utils
// /////////////////////////////////////////////////////////////////////////////
// ...

////////////////////////////////////////////////////////////////////////////////
// Sagas
////////////////////////////////////////////////////////////////////////////////

export function* fetchHighScores(challengeId) {
    try {
        const highScores = yield call(api.fetchHighScores, challengeId)
        
        yield put({ 
            type: types.FETCH_HIGH_SCORES_SUCCESS, 
            payload: highScores
            })

    } catch(error) {
        console.error(error)
    }
}

export function* saveScore(challengeId) {
    try {
        const payload = yield call(api.saveScore, challengeId)

        yield put({
            type: types.SUBMIT_SCORE_SUCCESS,
            payload
        })

    } catch (error) {
        console.error(error)
    }
}

export const sagas = [
    takeEvery(types.FETCH_HIGH_SCORES, fetchHighScores),
    takeEvery(types.SUBMIT_SCORE, saveScore)
]
