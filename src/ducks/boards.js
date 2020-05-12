import api from '../api/mainApi'

import { call, put, select, takeEvery } from 'redux-saga/effects'

import { createAction } from '@reduxjs/toolkit'

import { WALL, ROBOT, GOAL, Status } from '../constants'

import board from '../constants/board'

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

    FETCH_LATEST_CHALLENGE: 'FETCH_LATEST_CHALLENGE',
    FETCH_LATEST_CHALLENGE_SUCCESS: 'FETCH_LATEST_CHALLENGE_SUCCESS',

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

    fetchLatestChallenge: createAction(types.FETCH_LATEST_CHALLENGE),
    fetchPuzzlesByChallenge: createAction(types.FETCH_PUZZLES_BY_CHALLENGE),

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
    robots: {},
    history: [],
    selectedRobotPath: undefined,
    hoverRobotPath: undefined,
    hoverRobot: undefined,
    selectedRobot: undefined,
    robotTabOrder: [ROBOT.BLUE, ROBOT.GREEN, ROBOT.YELLOW, ROBOT.RED],
    metadata: {},
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.CLEAR_BOARD:
        return {
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
    case types.FETCH_LATEST_CHALLENGE_SUCCESS:
        return {
            ...state,
            challenge: {
                challengeId: action.payload.challengeId,
                startTime: action.payload.startTime,
                endTime: action.payload.endTime
            }
        }
    case types.FETCH_PUZZLES_BY_CHALLENGE_SUCCESS:
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
// const setWalls = (grid, x, y, walls) => grid[`${x},${y}`] = {...grid[`${x},${y}`], walls}
const setGoal = (grid, x, y, goal) => grid[`${x},${y}`] = {...grid[`${x},${y}`], goal}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

////////////////////////////////////////////////////////////////////////////////
// Sagas
////////////////////////////////////////////////////////////////////////////////

function rotateWall90(wall) {
    if(wall === 'N') {
        return 'E'
    } else if(wall === 'E') {
        return 'S'
    } else if(wall === 'S') {
        return 'W'
    } else if(wall === 'W') {
        return 'N'
    } else if(wall === 'NE') {
        return 'SE'
    } else if(wall === 'NW') {
        return 'NE'
    } else if(wall === 'SW') {
        return 'NW'
    } else if(wall === 'SE') {
        return 'SW'
    } else if(wall === 'X') {
        return 'X'
    } else {
        return ''
    }
}

function rotate(matrix, times = 1) {
    do {
        const N = matrix.length - 1
        const result = matrix.map((row, i) =>
            row.map((val, j) => rotateWall90(matrix[N - j][i]))
        )
        matrix.length = 0
        matrix.push(...result)

        --times
    } while(times > 0)
    return matrix
}

function processBoard(board, location) {
    let centerSquare = undefined
    let newBoard = JSON.parse(JSON.stringify(board))

    if(newBoard[0][0] === 'X') {
        centerSquare = 1
    } else if(newBoard[0][7] === 'X') {
        centerSquare = 2
    } else if(newBoard[7][0] === 'X') {
        centerSquare = 3
    } else if(newBoard[7][7] === 'X') {
        centerSquare = 4
    }

    if(centerSquare === 1) {
        if(location === 'TL') {
            newBoard = rotate(newBoard, 2)
        } else if(location === 'TR') {
            newBoard = rotate(newBoard, 3)
        } else if(location === 'BL') {
            newBoard = rotate(newBoard)
        } 
    } else if(centerSquare === 2) {
        if(location === 'TL') {
            newBoard = rotate(newBoard)
        } else if(location === 'TR') {
            newBoard = rotate(newBoard, 2)
        } else if(location === 'BR') {
            newBoard = rotate(newBoard, 3)
        }
    } else if(centerSquare === 3) {
        if(location === 'TL') {
            newBoard = rotate(newBoard, 3)
        } else if(location === 'BL') {
            newBoard = rotate(newBoard, 2)
        } else if(location === 'BR') {
            newBoard = rotate(newBoard)
        }
    } else if(centerSquare === 4) {
        if(location === 'TR') {
            newBoard = rotate(newBoard)
        } else if(location === 'BL') {  
            newBoard = rotate(newBoard, 3)
        } else if(location === 'BR') {
            newBoard = rotate(newBoard, 2)
        }
    }

    return newBoard
}

/**
 * Debug print the board
 * 
 * @param {*} board 
 */
// const printBoard = (board) => {
//     for(let y=0; y<board.length; y++) {
//         console.log(board[y].join(','))
//     }
// }

/**
 * Convert this to set up the board using Redux actions instead
 */
export function* setupBoard({payload}) {
    const randomBoard = () => {
        return [randomIntFromInterval(0,3), randomIntFromInterval(0,3), randomIntFromInterval(0,3), randomIntFromInterval(0,3)].join('')
    }

    let boardPayload = payload.config && payload.config.length === 4 ? payload.config : randomBoard()
    let boardSplit = boardPayload.split('').map(entry => Number(entry))

    if(boardSplit[0] < 0 || boardSplit[0] > 3 ||
        boardSplit[1] < 0 || boardSplit[1] > 3 ||
        boardSplit[2] < 0 || boardSplit[2] > 3 ||
        boardSplit[3] < 0 || boardSplit[3] > 3) {
        
        console.log("received bad payload")
        boardPayload = randomBoard()
        boardSplit = boardPayload.split('').map(entry => Number(entry))
    }

    let boardTL = board['classic']['RED'][boardSplit[0]]
    let boardTR = board['classic']['GREEN'][boardSplit[1]]
    let boardBL = board['classic']['YELLOW'][boardSplit[2]]
    let boardBR = board['classic']['BLUE'][boardSplit[3]]

    const TL = processBoard(boardTL, 'TL')
    const TR = processBoard(boardTR, 'TR')
    const BL = processBoard(boardBL, 'BL')
    const BR = processBoard(boardBR, 'BR')


    const boardGrid = []

    for(let t=0; t<8; t++) {
        boardGrid.push(TL[t].concat(TR[t]))
    }
    
    for(let tt=0; tt<8; tt++) {
        boardGrid.push(BL[tt].concat(BR[tt]))
    }

    const grid = {}

    const ACRONYM_TO_FULL = {
        'N': WALL.NORTH,
        'E': WALL.EAST,
        'S': WALL.SOUTH,
        'W': WALL.WEST,
        'NE': WALL.NORTH_EAST,
        'NW': WALL.NORTH_WEST,
        'SE': WALL.SOUTH_EAST,
        'SW': WALL.SOUTH_WEST,
        'X': WALL.ALL
    }
    for(let x = 0; x<16; x++) {
        for(let y = 0; y<16; y++) {
            let walls = 0

            const boardGridElement = boardGrid[y][x]
            if(boardGridElement !== '') {
                walls = ACRONYM_TO_FULL[boardGridElement]
            }

            grid[`${x},${y}`] = {
                x,
                y,
                walls: walls,
                robot: null,
                goal: null,
            }
        }
    }

    const corners = Object.values(grid).filter(element => element.walls === WALL.NORTH_WEST || element.walls === WALL.NORTH_EAST || element.walls === WALL.SOUTH_WEST || element === WALL.SOUTH_EAST)

    const goalIndex = payload.goalIndex >= 0 && payload.goalIndex < corners.length ? payload.goalIndex : randomIntFromInterval(0, corners.length - 1)
    const randomCorner = corners[goalIndex]

    const goals = Object.values(GOAL)

    const goalColorIndex = payload.goalColor >= 0 && payload.goalColor < goals.length ? payload.goalColor : randomIntFromInterval(0, goals.length - 1)
    const randomGoalColor = goals[goalColorIndex]
    
    setGoal(grid, randomCorner.x, randomCorner.y, randomGoalColor)

    // ROBOTS!
    let availableSpots = Object.values(grid).filter(element => element.walls !== WALL.ALL && !element.goal && !element.robot)

    const rIndex = payload.r >= 0 && payload.r < availableSpots.length ? payload.r : randomIntFromInterval(0, availableSpots.length - 1)
    const redLocation = availableSpots[rIndex]
    setRobot(grid, redLocation.x, redLocation.y, ROBOT.RED)
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.RED, x: redLocation.x, y: redLocation.y}})
    availableSpots.splice(rIndex, 1)

    const gIndex = payload.g >= 0 && payload.g < availableSpots.length ? payload.g : randomIntFromInterval(0, availableSpots.length - 1)
    const greenLocation = availableSpots[gIndex]
    setRobot(grid, greenLocation.x, greenLocation.y, ROBOT.GREEN)
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.GREEN, x: greenLocation.x, y: greenLocation.y}})
    availableSpots.splice(gIndex, 1)

    const bIndex = payload.b >= 0 && payload.b < availableSpots.length ? payload.b : randomIntFromInterval(0, availableSpots.length - 1)
    const blueLocation = availableSpots[bIndex]
    setRobot(grid, blueLocation.x, blueLocation.y, ROBOT.BLUE)
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.BLUE, x: blueLocation.x, y: blueLocation.y}})
    availableSpots.splice(bIndex, 1)

    const yIndex = payload.y >= 0 && payload.y < availableSpots.length ? payload.y : randomIntFromInterval(0, availableSpots.length - 1)
    const yellowLocation = availableSpots[yIndex]
    setRobot(grid, yellowLocation.x, yellowLocation.y, ROBOT.YELLOW)
    yield put({ type: types.SET_ROBOT, payload: { robot: ROBOT.YELLOW, x: yellowLocation.x, y: yellowLocation.y}})
    availableSpots.splice(yIndex, 1)


    // const query = `INSERT INTO challenge_puzzle (id, challenge_id, goal_color, goal_index, red_bot, green_bot, blue_bot, yellow_bot, config, created_at) VALUES (DEFAULT, '954369ba-d0e1-4b8f-b374-6960a08c6b2b', ${goalIndex}, ${goalColorIndex}, ${rIndex}, ${gIndex}, ${bIndex}, ${yIndex}, ${boardPayload}, DEFAULT)`
    //  console.log(query)

    yield put({ type: types.UPDATE_METADATA, payload: { 
            goalIndex, 
            goalColor: goalColorIndex, 
            r: rIndex, 
            g: gIndex, 
            b: bIndex, 
            y: yIndex,
            config: boardPayload,
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

const X_MIN = 0
const Y_MIN = 0
const X_MAX = 15
const Y_MAX = 15

export function* updateRobotPath({payload}) {
    // console.dir(payload)

    const grid = yield select(getGrid)

    const robots = yield select(getRobots)
    const selectedRobot = robots[payload]

    const { up, down, left, right } = illuminateThePath(grid, selectedRobot)

    yield put({ type: types.UPDATE_ROBOT_PATH, payload: { up, down, left, right }})
}

export function* updateHoverRobotPath({payload}) {
    const grid = yield select(getGrid)

    const robots = yield select(getRobots)
    const selectedRobot = robots[payload]

    if(selectedRobot) {
        const { up, down, left, right } = illuminateThePath(grid, selectedRobot)

        yield put({ type: types.UPDATE_HOVER_ROBOT_PATH_SUCCESS, payload: { up, down, left, right, robot: payload }})
    }
}
//  takeEvery(types.HOVER_ROBOT, updateHoverRobotPath),

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

        // console.log("Processing UP")
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

        // console.log("Processing DOWN")
        while(newY <= Y_MAX) {
            const newCell = grid[`${x},${newY}`]

            if(!done && y !== newY && newCell.robot) {
                down = down.slice(0, down.length)
                done = true
            }

            // console.log(newCell)
            if((!done && y !== newY) && (newCell.walls === WALL.NORTH || newCell.walls === WALL.NORTH_EAST || newCell.walls === WALL.NORTH_WEST || newCell.walls === WALL.ALL)) {
                // console.log(`if.DOWN: ${down.map(obj => `(${obj.x}, ${obj.y})`)}`)
                // console.log(`down.length: ${down.length}`)
                down = down.slice(0, down.length > 1 ? down.length : 0)  // we hit a wall prior
                // console.log(`if.after.slice.DOWN: ${down.map(obj => `(${obj.x}, ${obj.y})`)}`)
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

        // console.log("Processing LEFT")
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
            
            // console.log(`x: ${x} newX: ${newX} newCell.walls: ${newCell.walls} done: ${done}`)
            if((!done && x !== newX) && (newCell.walls === WALL.EAST || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.NORTH_EAST || newCell.walls === WALL.ALL)) {
                // console.dir(newCell)
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

        // console.log("Processing RIGHT")
        while(newX <= X_MAX) {
            const newCell = grid[`${newX},${y}`]

            if(!done && x !== newX && (newCell.robot || newCell.walls === WALL.ALL)) {
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

    // console.log(`UP ${up.map(obj => `(${obj.x}, ${obj.y})`)}`)
    // console.log(`DOWN ${down.map(obj => `(${obj.x}, ${obj.y})`)}`)
    // console.log(`LEFT ${left.map(obj => `(${obj.x}, ${obj.y})`)}`)
    // console.log(`RIGHT ${right.map(obj => `(${obj.x}, ${obj.y})`)}`)

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

export function* fetchLatestChallenge() {
    try {
        const latestChallenges = yield call(api.fetchLatestChallenge)

        const latestChallenge = latestChallenges[0]

        yield put({ type: types.FETCH_LATEST_CHALLENGE_SUCCESS, payload: { challengeId: latestChallenge.id, startTime: latestChallenge.start_time, endTime: latestChallenge.end_time }})

    } catch(error) {
        console.error(error)
    }
}

export function* fetchPuzzlesByChallenge({payload}) {
    console.dir(payload)
    
    try {
        const puzzles = yield call(api.fetchPuzzlesByChallenge, payload.challengeId)

        console.dir(puzzles)

    } catch(error) {
        console.error(error)
    }
}

export const sagas = [
  takeEvery(types.SETUP_BOARD, setupBoard),
  takeEvery(types.REFRESH_BOARD, refreshBoard),
  takeEvery(types.SELECT_ROBOT, updateRobotPath),

  takeEvery(types.UPDATE_HOVER_ROBOT_PATH, updateHoverRobotPath),

  takeEvery(types.FETCH_LATEST_CHALLENGE, fetchLatestChallenge),

  takeEvery(types.FETCH_PUZZLES_BY_CHALLENGE, fetchPuzzlesByChallenge),

  takeEvery(types.MOVE_UP, moveUp),
  takeEvery(types.MOVE_DOWN, moveDown),
  takeEvery(types.MOVE_LEFT, moveLeft),
  takeEvery(types.MOVE_RIGHT, moveRight),
  takeEvery(types.MOVE_SUCCESS, checkGoal),
]
