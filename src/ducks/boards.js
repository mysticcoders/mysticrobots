import { put, select, takeEvery } from 'redux-saga/effects'

import { createAction } from '@reduxjs/toolkit'

import { WALL, ROBOT, GOAL } from '../constants'

// /////////////////////////////////////////////////////////////////////////////
// Action Types
// /////////////////////////////////////////////////////////////////////////////

export const types = {

    SETUP_BOARD: 'SETUP_BOARD',
    SETUP_BOARD_SUCCESS: 'SETUP_BOARD_SUCCESS',
    SETUP_BOARD_ERROR: 'SETUP_BOARD_ERROR',

    MOVE_UP: 'MOVE_UP',
    MOVE_DOWN: 'MOVE_DOWN',
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',

    MOVE_SUCCESS: 'MOVE_SUCCESS',
    MOVE_ERROR: 'MOVE_ERROR',

    SET_ROBOT: 'SET_ROBOT',
}

// /////////////////////////////////////////////////////////////////////////////
// Action Creators
// /////////////////////////////////////////////////////////////////////////////

export const actions = {
    setupBoard: createAction(types.SETUP_BOARD),

    moveUp: createAction(types.MOVE_UP),
    moveDown: createAction(types.MOVE_DOWN),
    moveLeft: createAction(types.MOVE_LEFT),
    moveRight: createAction(types.MOVE_RIGHT),

    setRobot: createAction(types.SET_ROBOT),
}

// /////////////////////////////////////////////////////////////////////////////
// Reducers
// /////////////////////////////////////////////////////////////////////////////

export const initialState = {
    grid: {},
    robots: {},
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.MOVE_SUCCESS:

        console.dir(state.grid[`${action.payload.oldX},${action.payload.oldY}`].walls)
        console.dir(state.grid[`${action.payload.newX},${action.payload.newY}`].walls)
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
            }
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
    case types.SETUP_BOARD_SUCCESS:
        return {
            ...state,
            grid: action.payload
        }
    default:
      return state
  }
}

// /////////////////////////////////////////////////////////////////////////////
// Utils
// /////////////////////////////////////////////////////////////////////////////
const setRobot = (grid, x, y, robot) => grid[`${x},${y}`] = {...grid[`${x},${y}`], robot}
const setWalls = (grid, x, y, walls) => grid[`${x},${y}`] = {...grid[`${x},${y}`], walls}
const setGoal = (grid, x, y, goal) => grid[`${x},${y}`] = {...grid[`${x},${y}`], goal}

// /////////////////////////////////////////////////////////////////////////////
// Sagas
// /////////////////////////////////////////////////////////////////////////////
export function* setupBoard() {
    const grid = {}

    for(let x = 0; x<16; x++) {
        for(let y = 0; y<16; y++) {
            grid[`${x},${y}`] = {
                x,
                y,
                walls: 0,
                robot: null,
                goal: null,
            }
        }
    }

    setGoal(grid, 4, 13, GOAL.GREEN)

    // ROBOTS!
    setRobot(grid, 0, 3, ROBOT.RED)
    setRobot(grid, 12, 3, ROBOT.BLUE)
    setRobot(grid, 8, 13, ROBOT.YELLOW)
    setRobot(grid, 14, 9, ROBOT.GREEN)

    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.RED, x: 0, y: 3}})
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.BLUE, x: 12, y: 3}})
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.YELLOW, x: 8, y: 13}})
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.GREEN, x: 14, y: 9}})

    // WALLS
    setWalls(grid, 1, 0, WALL.EAST)
    setWalls(grid, 9, 0, WALL.EAST)

    setWalls(grid, 4, 1, WALL.NORTH_WEST)
    setWalls(grid, 14, 1, WALL.NORTH_WEST)

    setWalls(grid, 1, 2, WALL.NORTH_EAST)
    setWalls(grid, 11, 2, WALL.SOUTH_WEST)

    setWalls(grid, 6, 3, WALL.SOUTH_EAST)

    setWalls(grid, 0, 5, WALL.SOUTH)

    setWalls(grid, 3, 6, WALL.NORTH_WEST)
    setWalls(grid, 13, 6, WALL.SOUTH_EAST)

    setWalls(grid, 10, 7, WALL.NORTH_EAST)

    setWalls(grid, 15, 8, WALL.SOUTH)

    setWalls(grid, 0, 9, WALL.SOUTH)

    setWalls(grid, 3, 10, WALL.SOUTH_EAST)
    setWalls(grid, 8, 10, WALL.NORTH_WEST)
    setWalls(grid, 13, 10, WALL.NORTH_WEST)

    setWalls(grid, 5, 11, WALL.NORTH_EAST)
    setWalls(grid, 10, 11, WALL.SOUTH_EAST)

    setWalls(grid, 2, 12, WALL.SOUTH_WEST)
    setWalls(grid, 14, 12, WALL.SOUTH_WEST)

    setWalls(grid, 4, 13, WALL.NORTH_WEST)
    setWalls(grid, 9, 14, WALL.NORTH_EAST)

    setWalls(grid, 3, 15, WALL.EAST)
    setWalls(grid, 11, 15, WALL.EAST)

    // CENTER which is immovable!
    setWalls(grid, 7, 7, WALL.ALL)
    setWalls(grid, 7, 8, WALL.ALL)
    setWalls(grid, 8, 8, WALL.ALL)
    setWalls(grid, 8, 7, WALL.ALL)

    yield put({ type: types.SETUP_BOARD_SUCCESS, payload: grid})
}

export const getGrid = state => state.boards.grid

const X_MIN = 0
const Y_MIN = 0
const X_MAX = 15
const Y_MAX = 15

export function* moveUp({payload}) {
    const grid = yield select(getGrid)
    const {robot, x, y} = payload

    const selectedCell = grid[`${x},${y}`]
    if(selectedCell.robot === robot && y > Y_MIN) {
        let new_y = y

        let hit = false
        while(!hit) {
            --new_y

            const newCell = grid[`${x},${new_y}`]
            if(
                    newCell.wall === WALL.NORTH || 
                    newCell.wall === WALL.SOUTH || 
                    newCell.wall === WALL.NORTH_EAST || 
                    newCell.wall === WALL.NORTH_WEST || 
                    newCell.wall === WALL.SOUTH_EAST || 
                    newCell.wall === WALL.SOUTH_WEST || 
                    newCell.robot || new_y === Y_MIN) {

                ++new_y
                hit = true

            }
        }

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: x, newY: new_y, robot: robot}})
    }
}

export function* moveDown({payload}) {
    const grid = yield select(getGrid)
    const {robot, x, y} = payload

    const selectedCell = grid[`${x},${y}`]
    if(selectedCell.robot === robot && y < Y_MAX) {
        let new_y = y

        let hit = false
        while(!hit) {
            ++new_y

            const newCell = grid[`${x},${new_y}`]
            if(     
                newCell.wall === WALL.SOUTH || 
                newCell.wall === WALL.SOUTH_EAST || 
                newCell.wall === WALL.SOUTH_WEST || 
                newCell.wall === WALL.NORTH || 
                newCell.wall === WALL.NORTH_EAST || 
                newCell.wall === WALL.NORTH_WEST || 
                newCell.robot || 
                new_y === Y_MAX) {

                    --new_y
                    hit = true
            }
        }

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: x, newY: new_y, robot: robot}})
    }    
}

export function* moveLeft({payload}) {
    const grid = yield select(getGrid)
    const {robot, x, y} = payload

    const selectedCell = grid[`${x},${y}`]

    if(selectedCell.robot === robot && x > X_MIN) {
        let new_x = x

        let hit = false
        while(!hit) {
            --new_x

            const newCell = grid[`${new_x},${y}`]
            if(
                newCell.wall === WALL.WEST || 
                newCell.wall === WALL.EAST || 
                newCell.wall === WALL.NORTH_WEST || 
                newCell.wall === WALL.NORTH_EAST || 
                newCell.wall === WALL.SOUTH_WEST || 
                newCell.wall === WALL.SOUTH_EAST || 
                newCell.robot || 
                new_x === X_MIN) {
                
                    ++new_x
                    hit = true                
            }
        }

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: new_x, newY: y, robot: robot}})
    }    

}

export function* moveRight({payload}) {
    const grid = yield select(getGrid)
    const {robot, x, y} = payload

    const selectedCell = grid[`${x},${y}`]

    if(selectedCell.robot === robot && x < X_MAX) {
        let new_x = x

        let hit = false
        while(!hit) {
            ++new_x

            const newCell = grid[`${new_x},${y}`]
            if(
                newCell.wall === WALL.EAST || 
                newCell.wall === WALL.WEST || 
                newCell.wall === WALL.NORTH_EAST || 
                newCell.wall === WALL.SOUTH_EAST || 
                newCell.wall === WALL.NORTH_WEST || 
                newCell.wall === WALL.SOUTH_WEST || 
                newCell.robot || 
                new_x === X_MAX) {

                    --new_x
                    hit = true
            }
        }

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: new_x, newY: y, robot: robot}})
    }
}

export const sagas = [
  takeEvery(types.SETUP_BOARD, setupBoard),
  takeEvery(types.MOVE_UP, moveUp),
  takeEvery(types.MOVE_DOWN, moveDown),
  takeEvery(types.MOVE_LEFT, moveLeft),
  takeEvery(types.MOVE_RIGHT, moveRight),
]
