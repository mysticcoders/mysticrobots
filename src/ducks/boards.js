import { call, put, select, takeEvery } from 'redux-saga/effects'

import { createAction } from '@reduxjs/toolkit'

import { WALL, ROBOT, GOAL, Status } from '../constants'

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

    SET_ROBOT: 'SET_ROBOT',
    SELECT_ROBOT: 'SELECT_ROBOT',

    SELECT_NEXT_ROBOT: 'SELECT_NEXT_ROBOT',

    UPDATE_ROBOT_PATH: 'UPDATE_ROBOT_PATH',
    SET_STATUS: 'SET_STATUS',

    UPDATE_METADATA: 'UPDATE_METADATA',
}

// /////////////////////////////////////////////////////////////////////////////
// Action Creators
// /////////////////////////////////////////////////////////////////////////////

export const actions = {
    setupBoard: createAction(types.SETUP_BOARD),
    refreshBoard: createAction(types.REFRESH_BOARD),

    moveUp: createAction(types.MOVE_UP),
    moveDown: createAction(types.MOVE_DOWN),
    moveLeft: createAction(types.MOVE_LEFT),
    moveRight: createAction(types.MOVE_RIGHT),

    setRobot: createAction(types.SET_ROBOT),

    selectRobot: createAction(types.SELECT_ROBOT),

    selectNextRobot: createAction(types.SELECT_NEXT_ROBOT),

    setSelectedRobotPath: createAction(types.UPDATE_ROBOT_PATH),

    setStatus: createAction(types.SET_STATUS),

    updateMetadata: createAction(types.UPDATE_METADATA),
}

// /////////////////////////////////////////////////////////////////////////////
// Reducers
// /////////////////////////////////////////////////////////////////////////////

export const initialState = {
    status: Status.PLAYING,
    grid: {},
    robots: {},
    history: [],
    selectedRobotPath: {},
    selectedRobot: undefined,
    robotTabOrder: [ROBOT.BLUE, ROBOT.GREEN, ROBOT.YELLOW, ROBOT.RED],
    metadata: {},
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.CLEAR_BOARD:
        return {
            ...initialState,
        }
    case types.MOVE_SUCCESS:

        // console.dir(state.grid[`${action.payload.oldX},${action.payload.oldY}`].walls)
        // console.dir(state.grid[`${action.payload.newX},${action.payload.newY}`].walls)
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
        
        console.dir(state.robotTabOrder)
        console.dir(state.selectedRobot)
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

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// /////////////////////////////////////////////////////////////////////////////
// Sagas
// /////////////////////////////////////////////////////////////////////////////

/**
 * Convert this to set up the board using Redux actions instead
 */
export function* setupBoard({payload}) {
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

    // ROBOTS!
    setRobot(grid, 0, 3, ROBOT.RED)
    setRobot(grid, 12, 3, ROBOT.BLUE)
    setRobot(grid, 8, 13, ROBOT.YELLOW)
    setRobot(grid, 14, 9, ROBOT.GREEN)

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

    const corners = Object.values(grid).filter(element => element.walls === WALL.NORTH_WEST || element.walls === WALL.NORTH_EAST || element.walls === WALL.SOUTH_WEST || element === WALL.SOUTH_EAST)

    const goalIndex = payload.goalIndex >= 0 && payload.goalIndex < corners.length ? payload.goalIndex : randomIntFromInterval(0, corners.length - 1)
    const randomCorner = corners[goalIndex]

    const goals = Object.values(GOAL)

    const goalColorIndex = payload.goalColor >= 0 && payload.goalColor < goals.length ? payload.goalColor : randomIntFromInterval(0, goals.length - 1)
    const randomGoalColor = goals[goalColorIndex]
    
    setGoal(grid, randomCorner.x, randomCorner.y, randomGoalColor)

    yield put({ type: types.UPDATE_METADATA, payload: { goalIndex, goalColor: goalColorIndex }})

    // CENTER which is immovable!
    setWalls(grid, 7, 7, WALL.ALL)
    setWalls(grid, 7, 8, WALL.ALL)
    setWalls(grid, 8, 8, WALL.ALL)
    setWalls(grid, 8, 7, WALL.ALL)

    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.RED, x: 0, y: 3}})
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.BLUE, x: 12, y: 3}})
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.YELLOW, x: 8, y: 13}})
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.GREEN, x: 14, y: 9}})

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

const X_MIN = 0
const Y_MIN = 0
const X_MAX = 15
const Y_MAX = 15

export function* updateRobotPath({payload}) {
    console.dir(payload)

    const grid = yield select(getGrid)

    const robots = yield select(getRobots)
    const selectedRobot = robots[payload]

    const { up, down, left, right } = illuminateThePath(grid, selectedRobot)

    yield put({ type: types.UPDATE_ROBOT_PATH, payload: { up, down, left, right }})
}

const illuminateThePath = (grid, selectedRobot) => {
    const {x, y} = selectedRobot

    let up = []
    let down = []
    let left = []
    let right = []

    // UP
    if(y > Y_MIN) {
        let done = false
        let newY = y

        console.log("Processing UP")
        while(newY >= 0) {
            // console.log(`newY: ${newY}`)
            const newCell = grid[`${x},${newY}`]
            
            if(!done && y !== newY && newCell.robot) {
                up = up.slice(1)
                done = true
            }

            // console.log(newCell)
            if(!done && (newCell.walls === WALL.NORTH || newCell.walls === WALL.NORTH_WEST || newCell.walls === WALL.NORTH_EAST)) {
                up.push({x, y: newY})
                done = true
            }
            
            if((!done && y !== newY) && (newCell.walls === WALL.SOUTH || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.SOUTH_WEST || newCell.walls === WALL.ALL)) {
                // console.log(up)
                // console.log(`up.length: ${up.length}`)
                up = up.slice(1)  // we hit a wall prior
                // console.log(up)
                done = true
            }

            if(!done) {
                up.push({x, y: newY})
            }
            --newY
        }
    }

    // DOWN
    if(y < Y_MAX) {
        let done = false
        let newY = y

        console.log("Processing DOWN")
        while(newY <= Y_MAX) {
            const newCell = grid[`${x},${newY}`]

            if(!done && y !== newY && newCell.robot) {
                down = down.slice(down.length - 1)
                done = true
            }

            // console.log(newCell)
            if((!done && y !== newY) && (newCell.walls === WALL.NORTH || newCell.walls === WALL.NORTH_EAST || newCell.walls === WALL.NORTH_WEST || newCell.walls === WALL.ALL)) {
                console.log(`if.DOWN: ${down.map(obj => `(${obj.x}, ${obj.y})`)}`)
                console.log(`down.length: ${down.length}`)
                down = down.slice(0, down.length > 1 ? down.length : 0)  // we hit a wall prior
                console.log(`if.after.slice.DOWN: ${down.map(obj => `(${obj.x}, ${obj.y})`)}`)
                done = true
            } 

            if(!done && newY === y && (newCell.walls === WALL.SOUTH || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.SOUTH_WEST)) {
                done = true
            }

            if(!done && (newCell.walls === WALL.SOUTH || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.SOUTH_WEST)) {
                down.push({x, y: newY})
                done = true
            }

            if(!done) {
                down.push({x, y: newY})
            }

            ++newY            
        }
    }

    // LEFT
    if(x > X_MIN) {
        let done = false
        let newX = x

        console.log("Processing LEFT")
        while(newX >= 0) {
            const newCell = grid[`${newX},${y}`]

            if(!done && x !== newX && newCell.robot) {
                // console.log(`if.ROBOT.LEFT: ${left.map(obj => `(${obj.x}, ${obj.y})`)}`)
                left = left.slice(1)
                // console.log(`if.ROBOT.after.slice.LEFT: ${left.map(obj => `(${obj.x}, ${obj.y})`)}`)
                done = true
            }
            
            // console.log(newCell)
            if(!done && (newCell.walls === WALL.WEST || newCell.walls === WALL.NORTH_WEST || newCell.walls === WALL.SOUTH_WEST)) {
                if(x !== newX) {
                    left.push({x: newX, y})
                }
                done = true
            }
            
            if((!done && x !== newX) && (newCell.walls === WALL.EAST || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.ALL)) {
                // console.log(`if.LEFT: ${left.map(obj => `(${obj.x}, ${obj.y})`)}`)
                left = left.slice(1)  // we hit a wall prior
                // console.log(`if.after.slice.LEFT: ${left.map(obj => `(${obj.x}, ${obj.y})`)}`)
                done = true
            }

            if(!done) {
                left.push({x: newX, y})
            }
            --newX
        }
    }

    // RIGHT
    if(x < X_MAX) {
        let done = false
        let newX = x

        console.log("Processing RIGHT")
        while(newX <= X_MAX) {
            const newCell = grid[`${newX},${y}`]

            if(!done && x !== newX && newCell.robot) {
                // console.log(`2.if.RIGHT: ${right.map(obj => `(${obj.x}, ${obj.y})`)}`)
                right = right.slice(0, right.length > 1 ? right.length : 0)
                // console.log(`2.after.slice.if.RIGHT: ${right.map(obj => `(${obj.x}, ${obj.y})`)}`)
                done = true
            }

            // console.log(newCell)
            if((!done && x !== newX) && (newCell.walls === WALL.WEST || newCell.walls === WALL.SOUTH_WEST || newCell.walls === WALL.NORTH_WEST)) {
                // console.log(`if.RIGHT: ${right.map(obj => `(${obj.x}, ${obj.y})`)}`)
                right = right.slice(0, right.length > 1 ? right.length : 0)  // we hit a wall prior
                done = true
                // console.log(`if.after.slice.RIGHT: ${right.map(obj => `(${obj.x}, ${obj.y})`)}`)
            } 

            if(!done && (newCell.walls === WALL.EAST || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.NORTH_EAST)) {
                if(x !== newX) {
                    right.push({x: newX, y})
                }
                done = true
            }

            if(!done) {
                right.push({x: newX, y})
            }

            ++newX            
        }
    }    

    console.log(`UP ${up.map(obj => `(${obj.x}, ${obj.y})`)}`)
    console.log(`DOWN ${down.map(obj => `(${obj.x}, ${obj.y})`)}`)
    console.log(`LEFT ${left.map(obj => `(${obj.x}, ${obj.y})`)}`)
    console.log(`RIGHT ${right.map(obj => `(${obj.x}, ${obj.y})`)}`)

    return {
        up,
        down,
        left,
        right,
    }
}

export function* moveUp() {
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot
    const { up } = yield select(getRobotPath)

    if(up && up.length > 0) {
        const moveCoord = up[up.length-1]
        console.log(`(${moveCoord.x}, ${moveCoord.y})`)

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
        console.log(`(${moveCoord.x}, ${moveCoord.y})`)

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'DOWN'}})        
        yield call(updateRobotPath, { payload: robot})
    }  
}

export function* moveLeft() {
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot
    const { left } = yield select(getRobotPath)

    if(left && left.length > 0) {
        console.log(left)
        const moveCoord = left[left.length-1]
        console.log(`(${moveCoord.x}, ${moveCoord.y})`)

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
        console.log(`(${moveCoord.x}, ${moveCoord.y})`)

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'RIGHT'}})        
        yield call(updateRobotPath, { payload: robot})
    }  
}

export function* checkGoal() {
    const grid = yield select(getGrid)
    const robots = yield select(getRobots)

    const goal = Object.values(grid).filter(element => element.goal)[0]

    console.dir(goal)

    console.dir(`x:${goal.x} y:${goal.y}`)

    Object.values(robots).map(robot => console.dir(robot))

    const winningRobot = Object.values(robots).filter(robot => robot.x === goal.x && robot.y === goal.y && robot.robot === goal.goal)

    if(winningRobot && winningRobot.length === 1) {
        yield put({type: types.SET_STATUS, payload: Status.WIN})
    }
}

export const sagas = [
  takeEvery(types.SETUP_BOARD, setupBoard),
  takeEvery(types.REFRESH_BOARD, refreshBoard),
  takeEvery(types.SELECT_ROBOT, updateRobotPath),
  takeEvery(types.MOVE_UP, moveUp),
  takeEvery(types.MOVE_DOWN, moveDown),
  takeEvery(types.MOVE_LEFT, moveLeft),
  takeEvery(types.MOVE_RIGHT, moveRight),
  takeEvery(types.MOVE_SUCCESS, checkGoal),
]
