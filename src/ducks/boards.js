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
    SELECT_ROBOT: 'SELECT_ROBOT',

    SELECT_NEXT_ROBOT: 'SELECT_NEXT_ROBOT',
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

    selectRobot: createAction(types.SELECT_ROBOT),

    selectNextRobot: createAction(types.SELECT_NEXT_ROBOT),
}

// /////////////////////////////////////////////////////////////////////////////
// Reducers
// /////////////////////////////////////////////////////////////////////////////

export const initialState = {
    grid: {},
    robots: {},
    history: [],
    selectedRobot: ROBOT.BLUE,
    robotTabOrder: [ROBOT.BLUE, ROBOT.GREEN, ROBOT.YELLOW, ROBOT.RED],
}

export default function (state = initialState, action) {
  switch (action.type) {
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
export const getSelectedRobot = state => state.boards.robots[state.boards.selectedRobot]

const X_MIN = 0
const Y_MIN = 0
const X_MAX = 15
const Y_MAX = 15

const illuminateThePath = (grid, selectedRobot) => {
    const {x, y} = selectedRobot

    // const robotCell = grid[`${x},${y}`]

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
            
            console.log(newCell)
            if(!done && (newCell.walls === WALL.NORTH || newCell.walls === WALL.NORTH_WEST || newCell.walls === WALL.NORTH_EAST)) {
                up.push({x, y: newY})
                done = true
            }
            
            if(!done && y !== newY && newCell.robot) {
                up = up.slice(1)
                done = true
            }

            if((!done && y !== newY) && (newCell.walls === WALL.SOUTH || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.SOUTH_WEST)) {
                console.log(up)
                console.log(`up.length: ${up.length}`)
                up = up.slice(1)  // we hit a wall prior
                console.log(up)
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

            console.log(newCell)
            if((!done && y !== newY) && (newCell.walls === WALL.NORTH || newCell.walls === WALL.NORTH_EAST || newCell.walls === WALL.NORTH_WEST)) {
                console.log(down)
                console.log(`down.length: ${down.length}`)
                down = down.slice(down.length - 1)  // we hit a wall prior
                done = true
                console.log(down)
            } 

            if(!done && y !== newY && newCell.robot) {
                down = down.slice(down.length - 1)
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

    // TODO need to go through LEFT and RIGHT because the mechanics aren't accurate yet
    // LEFT
    if(x > X_MIN) {
        let done = false
        let newX = x

        console.log("Processing LEFT")
        while(newX >= 0) {
            const newCell = grid[`${newX},${y}`]
            
            console.log(newCell)
            if(!done && (newCell.walls === WALL.WEST || newCell.walls === WALL.NORTH_WEST || newCell.walls === WALL.NORTH_EAST)) {
                left.push({x: newX, y})
                done = true
            }
            
            if(!done && x !== newX && newCell.robot) {
                left = left.slice(1)
                done = true
            }

            if((!done && x !== newX) && (newCell.walls === WALL.EAST || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.SOUTH_WEST)) {
                console.log(left)
                console.log(`left.length: ${left.length}`)
                left = left.slice(1)  // we hit a wall prior
                console.log(left)
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

            console.log(newCell)
            if((!done && x !== newX) && (newCell.walls === WALL.WEST || newCell.walls === WALL.NORTH_EAST || newCell.walls === WALL.NORTH_WEST)) {
                console.log(right)
                console.log(`right.length: ${right.length}`)
                right = right.slice(right.length - 1)  // we hit a wall prior
                done = true
                console.log(right)
            } 

            if(!done && x !== newX && newCell.robot) {
                right = right.slice(right.length - 1)
                done = true
            }

            if(!done && newX === x && (newCell.walls === WALL.EAST || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.SOUTH_WEST)) {
                done = true
            }

            if(!done && (newCell.walls === WALL.EAST || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.SOUTH_WEST)) {
                right.push({x: newX, y})
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
    const grid = yield select(getGrid)
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot

    const { up } = illuminateThePath(grid, selectedRobot)

    if(up && up.length > 0) {
        const moveCoord = up[up.length-1]
        console.log(`(${moveCoord.x}, ${moveCoord.y})`)

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'UP'}})
    }
}

export function* moveDown() {
    const grid = yield select(getGrid)
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot
    const { down } = illuminateThePath(grid, selectedRobot)

    if(down && down.length > 0) {
        const moveCoord = down[down.length-1]
        console.log(`(${moveCoord.x}, ${moveCoord.y})`)

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'DOWN'}})        
    }  
}

export function* moveLeft() {
    const grid = yield select(getGrid)
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot
    const { left } = illuminateThePath(grid, selectedRobot)

    if(left && left.length > 0) {
        console.log(left)
        const moveCoord = left[left.length-1]
        console.log(`(${moveCoord.x}, ${moveCoord.y})`)

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'LEFT'}})        
    }  

    // const selectedCell = grid[`${x},${y}`]

    // if(selectedCell.robot === robot && x > X_MIN) {
    //     let new_x = x

    //     let initial = true
    //     let hit = false
    //     while(!hit) {

    //         const newCell = grid[`${new_x},${y}`]

    //         console.dir(newCell)

    //         if(newCell.walls === WALL.WEST || 
    //             newCell.walls === WALL.NORTH_WEST || 
    //             newCell.walls === WALL.SOUTH_WEST ||
    //             (newCell.robot && new_x !== x)) {

    //             hit = true
    //         } else if(
    //             newCell.walls === WALL.EAST || 
    //             newCell.walls === WALL.NORTH_EAST || 
    //             newCell.walls === WALL.SOUTH_EAST || 
    //             new_x === X_MIN) {
                
    //                 if(new_x !== x) {
    //                     ++new_x
    //                 }
    //                 hit = true
    //         } else if ( new_x === X_MIN ) {
    //             hit = true
    //         }

    //         if(!hit) {
    //             --new_x
    //             initial = false
    //         }

    //     }

    //     if(!initial) {
    //         yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: new_x, newY: y, robot: robot, direction: 'LEFT'}})
    //     }
    // }    

}

export function* moveRight() {
    const grid = yield select(getGrid)
    const selectedRobot = yield select(getSelectedRobot)

    const {robot, x, y} = selectedRobot
    const { right } = illuminateThePath(grid, selectedRobot)

    if(right && right.length > 0) {
        const moveCoord = right[right.length-1]
        console.log(`(${moveCoord.x}, ${moveCoord.y})`)

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'RIGHT'}})        
    }  

    // illuminateThePath(grid, selectedRobot)

    // const {robot, x, y} = selectedRobot

    // const selectedCell = grid[`${x},${y}`]

    // if(selectedCell.robot === robot && x < X_MAX) {
    //     let new_x = x

    //     let hit = false
    //     while(!hit) {

    //         const newCell = grid[`${new_x},${y}`]

    //         if(newCell.walls === WALL.EAST || 
    //             newCell.walls === WALL.NORTH_EAST || 
    //             newCell.walls === WALL.SOUTH_EAST || 
    //             (newCell.robot && new_x !== x)) {

    //                 hit = true

    //         } else if(
    //             newCell.walls === WALL.WEST || 
    //             newCell.walls === WALL.NORTH_WEST || 
    //             newCell.walls === WALL.SOUTH_WEST
    //         ) {

    //             if(new_x !== x) {
    //                 --new_x
    //             }
    //             hit = true

    //         } else if(new_x === X_MAX) {

    //             hit = true

    //         }

    //         if(!hit) ++new_x
    //     }

    //     yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: new_x, newY: y, robot: robot, direction: 'RIGHT'}})
    // }
}

export const sagas = [
  takeEvery(types.SETUP_BOARD, setupBoard),
  takeEvery(types.MOVE_UP, moveUp),
  takeEvery(types.MOVE_DOWN, moveDown),
  takeEvery(types.MOVE_LEFT, moveLeft),
  takeEvery(types.MOVE_RIGHT, moveRight),
]
