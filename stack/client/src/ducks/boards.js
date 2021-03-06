import api from '../api/mainApi'

import { call, put, select, takeEvery } from 'redux-saga/effects'

import { createAction } from '@reduxjs/toolkit'

import { board, Status, ROBOT } from 'common'

// /////////////////////////////////////////////////////////////////////////////
// Action Types
// /////////////////////////////////////////////////////////////////////////////

export const types = {

    SETUP_BOARD: 'SETUP_BOARD',
    CLEAR_BOARD: 'CLEAR_BOARD',
    REFRESH_BOARD: 'REFRESH_BOARD',

    SETUP_BOARD_SUCCESS: 'SETUP_BOARD_SUCCESS',
    SETUP_BOARD_ERROR: 'SETUP_BOARD_ERROR',

    MOVE_UP: 'MOVE_UP',
    MOVE_DOWN: 'MOVE_DOWN',
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',

    MOVE_SUCCESS: 'MOVE_SUCCESS',
    MOVE_ERROR: 'MOVE_ERROR',

    FETCH_PUZZLE: 'FETCH_PUZZLE',
    FETCH_PUZZLE_SUCCESS: 'FETCH_PUZZLE_SUCCESS',
    FETCH_PUZZLE_ERROR: 'FETCH_PUZZLE_ERROR',

    FETCH_PUZZLES_BY_CHALLENGE: 'FETCH_PUZZLES_BY_CHALLENGE',
    FETCH_PUZZLES_BY_CHALLENGE_SUCCESS: 'FETCH_PUZZLES_BY_CHALLENGE_SUCCESS',

    SET_ROBOT: 'SET_ROBOT',
    SELECT_ROBOT: 'SELECT_ROBOT',

    SELECT_NEXT_ROBOT: 'SELECT_NEXT_ROBOT',

    UPDATE_ROBOT_PATH: 'UPDATE_ROBOT_PATH',
    SET_STATUS: 'SET_STATUS',

    UPDATE_METADATA: 'UPDATE_METADATA',

    UPDATE_HOVER_ROBOT_PATH: 'UPDATE_HOVER_ROBOT_PATH',
    UPDATE_HOVER_ROBOT_PATH_SUCCESS: 'UPDATE_HOVER_ROBOT_PATH_SUCCESS',
    CLEAR_HOVER_ROBOT_PATH: 'CLEAR_HOVER_ROBOT_PATH',
}

////////////////////////////////////////////////////////////////////////////////
// Action Creators
////////////////////////////////////////////////////////////////////////////////

export const actions = {
    setupBoard: createAction(types.SETUP_BOARD),
    clearBoard: createAction(types.CLEAR_BOARD),
    refreshBoard: createAction(types.REFRESH_BOARD),

    moveUp: createAction(types.MOVE_UP),
    moveDown: createAction(types.MOVE_DOWN),
    moveLeft: createAction(types.MOVE_LEFT),
    moveRight: createAction(types.MOVE_RIGHT),

    fetchPuzzlesByChallenge: createAction(types.FETCH_PUZZLES_BY_CHALLENGE),
    fetchPuzzle: createAction(types.FETCH_PUZZLE),

    setRobot: createAction(types.SET_ROBOT),

    selectRobot: createAction(types.SELECT_ROBOT),

    selectNextRobot: createAction(types.SELECT_NEXT_ROBOT),

    setSelectedRobotPath: createAction(types.UPDATE_ROBOT_PATH),

    setStatus: createAction(types.SET_STATUS),

    updateMetadata: createAction(types.UPDATE_METADATA),

    updateHoverRobotPath: createAction(types.UPDATE_HOVER_ROBOT_PATH),

    clearHoverRobotPath: createAction(types.CLEAR_HOVER_ROBOT_PATH),

}

////////////////////////////////////////////////////////////////////////////////
// Reducers
////////////////////////////////////////////////////////////////////////////////

export const initialState = {
    status: Status.PLAYING,
    grid: {},
    grids: {},
    robots: {},
    history: [],
    selectedRobotPath: undefined,
    hoverRobotPath: undefined,
    hoverRobot: undefined,
    selectedRobot: undefined,
    robotTabOrder: [ROBOT.BLUE, ROBOT.GREEN, ROBOT.YELLOW, ROBOT.RED],
    puzzles: undefined,
    metadata: {},
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.CLEAR_BOARD:
        return {
            ...state,
            status: Status.PLAYING,
            robots: {},
            history: [],
            selectedRobotPath: undefined,
            hoverRobotPath: undefined,
            hoverRobot: undefined,
            selectedRobot: undefined,
            metadata: {},
        }
    case types.MOVE_SUCCESS:
        return {
            ...state,
            grid: {
                ...state.grid,
                [`${action.payload.oldX},${action.payload.oldY}`]: {
                    x: action.payload.oldX,
                    y: action.payload.oldY,
                    walls: state.grid[`${action.payload.oldX},${action.payload.oldY}`].walls,
                    robot: null,
                    goal: state.grid[`${action.payload.oldX},${action.payload.oldY}`].goal,
                },                
                [`${action.payload.newX},${action.payload.newY}`]: {
                    x: action.payload.newX,
                    y: action.payload.newY,
                    walls: state.grid[`${action.payload.newX},${action.payload.newY}`].walls,
                    robot: action.payload.robot,
                    goal: state.grid[`${action.payload.newX},${action.payload.newY}`].goal,
                },
            },
            robots: {
                ...state.robots,
                [action.payload.robot]: {
                    x: action.payload.newX,
                    y: action.payload.newY,
                    robot: action.payload.robot,
                }                
            },
            history: state.history.concat({ direction: action.payload.direction, robot: action.payload.robot})
        }
    case types.SET_ROBOT:
        return {
            ...state,
            robots: {
                ...state.robots,
                [action.payload.robot]: {
                    x: action.payload.x,
                    y: action.payload.y,
                    robot: action.payload.robot,
                }
            }
        }
    case types.SELECT_ROBOT:
        return {
            ...state,
            selectedRobot: action.payload
        }
    case types.SETUP_BOARD_SUCCESS:
        return {
            ...state,
            grid: action.payload
        }
    case types.SELECT_NEXT_ROBOT:
        // TODO defunct, this doesn't work ... perhaps if we have a "tab" functionality        
        return {
            ...state
        }
    case types.UPDATE_ROBOT_PATH:
        return {
            ...state,
            selectedRobotPath: {
                up: action.payload.up,
                down: action.payload.down,
                left: action.payload.left,
                right: action.payload.right,
            }
        }
    case types.UPDATE_HOVER_ROBOT_PATH_SUCCESS:
        return {
            ...state,
            hoverRobotPath: {
                up: action.payload.up,
                down: action.payload.down,
                left: action.payload.left,
                right: action.payload.right,
            },
            hoverRobot: action.payload.robot
        }
    case types.CLEAR_HOVER_ROBOT_PATH:
        return {
            ...state,
            hoverRobotPath: undefined,
            hoverRobot: undefined,
        }
    case types.SET_STATUS:
        return {
            ...state,
            status: action.payload,
        }
    case types.UPDATE_METADATA:
        return {
            ...state,
            metadata: action.payload,
        }
    case types.FETCH_PUZZLES_BY_CHALLENGE_SUCCESS:
        return {
            ...state,
            puzzles: action.payload,
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

/**
 * Convert this to set up the board using Redux actions instead
 */
export function* setupBoard({payload}) {

    const grid = {}
    const boardData = board.setupBoard({ grid, config: payload.config })
    const goalData = board.setupGoal({ grid: grid, goalIndex: payload.goalIndex, goalColor: payload.goalColor })
    const robotData = board.setupRobots({ grid: grid, r: payload.r, g: payload.g, b: payload.b, y: payload.y })

    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.RED, x: robotData.redLocation.x, y: robotData.redLocation.y}})
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.GREEN, x: robotData.greenLocation.x, y: robotData.greenLocation.y}})
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.BLUE, x: robotData.blueLocation.x, y: robotData.blueLocation.y}})
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.YELLOW, x: robotData.yellowLocation.x, y: robotData.yellowLocation.y}})
 
    yield put({ type: types.UPDATE_METADATA, payload: { 
            goalIndex: goalData.goalIndex,
            goalColor: goalData.goalColor,
            r: robotData.rIndex, 
            g: robotData.gIndex, 
            b: robotData.bIndex, 
            y: robotData.yIndex,
            config: boardData.config,
        }})

    yield put({ type: types.SETUP_BOARD_SUCCESS, payload: grid})
    yield put({ type: types.SELECT_ROBOT, payload: ROBOT.RED })

}

export function* refreshBoard() {
    yield put({type: types.CLEAR_BOARD})
    yield call(setupBoard)
    yield put({type: types.SET_STATUS, payload: Status.PLAYING})
}

export const getGrid = state => state.boards.grid
export const getSelectedRobot = state => state.boards.robots[state.boards.selectedRobot]

export const getRobotPath = state => state.boards.selectedRobotPath

export const getRobots = state => state.boards.robots

export function* updateRobotPath({payload}) {
    // console.dir(payload)

    const grid = yield select(getGrid)

    const robots = yield select(getRobots)
    const selectedRobot = robots[payload]

    const { up, down, left, right } = board.illuminateThePath({grid, selectedRobot})

    yield put({ type: types.UPDATE_ROBOT_PATH, payload: { up, down, left, right }})
}

export function* updateHoverRobotPath({payload}) {
    const grid = yield select(getGrid)

    const robots = yield select(getRobots)
    const selectedRobot = robots[payload]

    if(selectedRobot) {
        const { up, down, left, right } = board.illuminateThePath({grid, selectedRobot})

        yield put({ type: types.UPDATE_HOVER_ROBOT_PATH_SUCCESS, payload: { up, down, left, right, robot: payload }})
    }
}

export function* moveUp() {
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot
    const { up } = yield select(getRobotPath)

    if(up && up.length > 0) {
        const moveCoord = up[up.length-1]

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'UP'}})
        yield call(updateRobotPath, { payload: robot})
    }
}

export function* moveDown() {
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot
    const { down } = yield select(getRobotPath)

    if(down && down.length > 0) {
        const moveCoord = down[down.length-1]

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'DOWN'}})        
        yield call(updateRobotPath, { payload: robot})
    }  
}

export function* moveLeft() {
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot
    const { left } = yield select(getRobotPath)

    if(left && left.length > 0) {
        const moveCoord = left[left.length-1]

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'LEFT'}})        
        yield call(updateRobotPath, { payload: robot})
    }  
}

export function* moveRight() {
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot
    const { right } = yield select(getRobotPath)

    if(right && right.length > 0) {
        const moveCoord = right[right.length-1]

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'RIGHT'}})        
        yield call(updateRobotPath, { payload: robot})
    }  
}

export function* checkGoal() {
    const grid = yield select(getGrid)
    const robots = yield select(getRobots)

    const goal = Object.values(grid).filter(element => element.goal)[0]

    const winningRobot = Object.values(robots).filter(robot => robot.x === goal.x && robot.y === goal.y && robot.robot === goal.goal)

    if(winningRobot && winningRobot.length === 1) {
        yield put({type: types.SET_STATUS, payload: Status.WIN})
    }
}

export function* fetchPuzzle({payload}) {
    const { id } = payload

    try {
        const puzzle = yield call(api.fetchPuzzle, id)

        yield put({ type: types.UPDATE_METADATA, payload: { 
            config: puzzle.config,
            goalIndex: puzzle.goal_index,
            goalColor: puzzle.goal_color,
            r: puzzle.red_bot,
            g: puzzle.green_bot,
            b: puzzle.blue_bot,
            y: puzzle.yellow_bot,
        }})

    } catch(error) {
        console.error(error)
    }
}

export function* fetchPuzzlesByChallenge({payload}) {
    console.dir(payload)
    
    try {
        const puzzles = yield call(api.fetchPuzzlesByChallenge, payload.challengeId)

        yield put({ type: types.FETCH_PUZZLES_BY_CHALLENGE_SUCCESS, payload: puzzles})

    } catch(error) {
        console.error(error)
    }
}

export const sagas = [
  takeEvery(types.SETUP_BOARD, setupBoard),
  takeEvery(types.REFRESH_BOARD, refreshBoard),
  takeEvery(types.SELECT_ROBOT, updateRobotPath),

  takeEvery(types.UPDATE_HOVER_ROBOT_PATH, updateHoverRobotPath),

  takeEvery(types.FETCH_PUZZLE, fetchPuzzle),
  takeEvery(types.FETCH_PUZZLES_BY_CHALLENGE, fetchPuzzlesByChallenge),

  takeEvery(types.MOVE_UP, moveUp),
  takeEvery(types.MOVE_DOWN, moveDown),
  takeEvery(types.MOVE_LEFT, moveLeft),
  takeEvery(types.MOVE_RIGHT, moveRight),
  takeEvery(types.MOVE_SUCCESS, checkGoal),
]
