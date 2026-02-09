import { call, put, select, takeEvery } from 'redux-saga/effects'

import { createAction } from '@reduxjs/toolkit'

import { WALL, ROBOT, GOAL, Status } from '../constants'

import board from '../constants/board'

import { solve } from '../solver/solver'

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

    START_TIMER: 'START_TIMER',
    STOP_TIMER: 'STOP_TIMER',
    RESET_TIMER: 'RESET_TIMER',

    SET_ROBOT: 'SET_ROBOT',
    SELECT_ROBOT: 'SELECT_ROBOT',

    SELECT_NEXT_ROBOT: 'SELECT_NEXT_ROBOT',

    UPDATE_ROBOT_PATH: 'UPDATE_ROBOT_PATH',
    SET_STATUS: 'SET_STATUS',

    UPDATE_METADATA: 'UPDATE_METADATA',

    UPDATE_HOVER_ROBOT_PATH: 'UPDATE_HOVER_ROBOT_PATH',
    UPDATE_HOVER_ROBOT_PATH_SUCCESS: 'UPDATE_HOVER_ROBOT_PATH_SUCCESS',
    CLEAR_HOVER_ROBOT_PATH: 'CLEAR_HOVER_ROBOT_PATH',

    SOLVE_PUZZLE: 'SOLVE_PUZZLE',
    SOLVE_PUZZLE_SUCCESS: 'SOLVE_PUZZLE_SUCCESS',
    SOLVE_PUZZLE_ERROR: 'SOLVE_PUZZLE_ERROR',
    REQUEST_HINT: 'REQUEST_HINT',
    SHOW_NEXT_HINT: 'SHOW_NEXT_HINT',
    DISMISS_HINT: 'DISMISS_HINT',

    COMPLETE_ROBOT: 'COMPLETE_ROBOT',
}

// /////////////////////////////////////////////////////////////////////////////
// Action Creators
// /////////////////////////////////////////////////////////////////////////////

export const actions = {
    setupBoard: createAction(types.SETUP_BOARD),
    clearBoard: createAction(types.CLEAR_BOARD),
    refreshBoard: createAction(types.REFRESH_BOARD),

    moveUp: createAction(types.MOVE_UP),
    moveDown: createAction(types.MOVE_DOWN),
    moveLeft: createAction(types.MOVE_LEFT),
    moveRight: createAction(types.MOVE_RIGHT),

    startTimer: createAction(types.START_TIMER),
    stopTimer: createAction(types.STOP_TIMER),
    resetTimer: createAction(types.RESET_TIMER),

    setRobot: createAction(types.SET_ROBOT),

    selectRobot: createAction(types.SELECT_ROBOT),

    selectNextRobot: createAction(types.SELECT_NEXT_ROBOT),

    setSelectedRobotPath: createAction(types.UPDATE_ROBOT_PATH),

    setStatus: createAction(types.SET_STATUS),

    updateMetadata: createAction(types.UPDATE_METADATA),

    updateHoverRobotPath: createAction(types.UPDATE_HOVER_ROBOT_PATH),

    clearHoverRobotPath: createAction(types.CLEAR_HOVER_ROBOT_PATH),

    requestHint: createAction(types.REQUEST_HINT),
    dismissHint: createAction(types.DISMISS_HINT),

    completeRobot: createAction(types.COMPLETE_ROBOT),

}

// /////////////////////////////////////////////////////////////////////////////
// Reducers
// /////////////////////////////////////////////////////////////////////////////

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
    solution: null,
    optimalMoves: -1,
    solverStatus: 'idle',
    hintIndex: -1,
    completedRobots: [],
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
            solution: null,
            optimalMoves: -1,
            solverStatus: 'idle',
            hintIndex: -1,
            completedRobots: [],
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
            history: state.history.concat({ direction: action.payload.direction, robot: action.payload.robot}),
            solution: null,
            optimalMoves: -1,
            solverStatus: 'idle',
            hintIndex: -1,
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
            selectedRobot: action.payload,
            solution: null,
            optimalMoves: -1,
            solverStatus: 'idle',
            hintIndex: -1,
        }
    case types.SETUP_BOARD_SUCCESS:
        return {
            ...state,
            grid: action.payload
        }
    case types.SELECT_NEXT_ROBOT:
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
    case types.SOLVE_PUZZLE:
        return {
            ...state,
            solverStatus: 'solving',
        }
    case types.SOLVE_PUZZLE_SUCCESS:
        return {
            ...state,
            solution: action.payload.solution,
            optimalMoves: action.payload.optimalMoves,
            solverStatus: action.payload.solution ? 'solved' : 'unsolvable',
        }
    case types.SOLVE_PUZZLE_ERROR:
        return {
            ...state,
            solverStatus: 'error',
        }
    case types.SHOW_NEXT_HINT:
        return {
            ...state,
            hintIndex: state.hintIndex + 1,
        }
    case types.DISMISS_HINT:
        return {
            ...state,
            hintIndex: -1,
        }
    case types.COMPLETE_ROBOT: {
        const robotName = action.payload
        const robotData = state.robots[robotName]
        const newRobots = { ...state.robots }
        delete newRobots[robotName]

        let newGrid = state.grid
        if (robotData) {
            const cellKey = `${robotData.x},${robotData.y}`
            newGrid = {
                ...state.grid,
                [cellKey]: {
                    ...state.grid[cellKey],
                    robot: null,
                },
            }
        }

        return {
            ...state,
            completedRobots: [...state.completedRobots, robotName],
            robots: newRobots,
            grid: newGrid,
            solution: null,
            optimalMoves: -1,
            solverStatus: 'idle',
            hintIndex: -1,
        }
    }
    default:
      return state
  }
}

// /////////////////////////////////////////////////////////////////////////////
// Utils
// /////////////////////////////////////////////////////////////////////////////
const setRobot = (grid, x, y, robot) => grid[`${x},${y}`] = {...grid[`${x},${y}`], robot}
const setGoal = (grid, x, y, goal) => grid[`${x},${y}`] = {...grid[`${x},${y}`], goal}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// /////////////////////////////////////////////////////////////////////////////
// Selectors
// /////////////////////////////////////////////////////////////////////////////

export const getGrid = state => state.boards.grid
export const getSelectedRobot = state => state.boards.robots[state.boards.selectedRobot]
export const getRobotPath = state => state.boards.selectedRobotPath
export const getRobots = state => state.boards.robots
export const getCompletedRobots = state => state.boards.completedRobots

export const getCurrentHint = state => {
    const { solution, hintIndex } = state.boards
    if (!solution || hintIndex < 0 || hintIndex >= solution.length) return null
    return solution[hintIndex]
}

// /////////////////////////////////////////////////////////////////////////////
// Sagas
// /////////////////////////////////////////////////////////////////////////////


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

function processBoards(boardTL, boardTR, boardBL, boardBR) {

    return {
        TL: processBoard(boardTL, 'TL'),
        TR: processBoard(boardTR, 'TR'),
        BL: processBoard(boardBL, 'BL'),
        BR: processBoard(boardBR, 'BR')
    }
}

const X_MIN = 0
const Y_MIN = 0
const X_MAX = 15
const Y_MAX = 15

/**
 * Set up the game board by assembling 4 rotated quadrants, placing goal and robots
 */
export function* setupBoard({payload}) {
    let boardKeys = Object.keys(board)

    const randomBoard = () => {
        return [randomIntFromInterval(0,3), randomIntFromInterval(0,3), randomIntFromInterval(0,3), randomIntFromInterval(0,3)].join('')
    }

    let boardPayload = payload.config && payload.config.length === 4 ? payload.config : randomBoard()
    let boardSplit = boardPayload.split('').map(entry => Number(entry))

    if(boardSplit[0] < 0 || boardSplit[0] > 3 ||
        boardSplit[1] < 0 || boardSplit[1] > 3 ||
        boardSplit[2] < 0 || boardSplit[2] > 3 ||
        boardSplit[3] < 0 || boardSplit[3] > 3) {

        boardPayload = randomBoard()
        boardSplit = boardPayload.split('').map(entry => Number(entry))
    }

    let boardTL = board['classic']['RED'][boardSplit[0]]
    let boardTR = board['classic']['GREEN'][boardSplit[1]]
    let boardBL = board['classic']['YELLOW'][boardSplit[2]]
    let boardBR = board['classic']['BLUE'][boardSplit[3]]

    const { TL, TR, BL, BR } = processBoards(boardTL, boardTR, boardBL, boardBR)

    const boardGrid = []
    boardGrid.push(TL[0].concat(TR[0]))
    boardGrid.push(TL[1].concat(TR[1]))
    boardGrid.push(TL[2].concat(TR[2]))
    boardGrid.push(TL[3].concat(TR[3]))
    boardGrid.push(TL[4].concat(TR[4]))
    boardGrid.push(TL[5].concat(TR[5]))
    boardGrid.push(TL[6].concat(TR[6]))
    boardGrid.push(TL[7].concat(TR[7]))
    boardGrid.push(BL[0].concat(BR[0]))
    boardGrid.push(BL[1].concat(BR[1]))
    boardGrid.push(BL[2].concat(BR[2]))
    boardGrid.push(BL[3].concat(BR[3]))
    boardGrid.push(BL[4].concat(BR[4]))
    boardGrid.push(BL[5].concat(BR[5]))
    boardGrid.push(BL[6].concat(BR[6]))
    boardGrid.push(BL[7].concat(BR[7]))

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

    const corners = Object.values(grid).filter(element =>
        element.walls === WALL.NORTH_WEST ||
        element.walls === WALL.NORTH_EAST ||
        element.walls === WALL.SOUTH_WEST ||
        element.walls === WALL.SOUTH_EAST
    )

    const goalIndex = payload.goalIndex >= 0 && payload.goalIndex < corners.length ? payload.goalIndex : randomIntFromInterval(0, corners.length - 1)
    const randomCorner = corners[goalIndex]

    const goals = Object.values(GOAL)

    const goalColorIndex = payload.goalColor >= 0 && payload.goalColor < goals.length ? payload.goalColor : randomIntFromInterval(0, goals.length - 1)
    const randomGoalColor = goals[goalColorIndex]

    setGoal(grid, randomCorner.x, randomCorner.y, randomGoalColor)

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

/**
 * Run the BFS solver for the currently selected robot
 */
export function* solvePuzzleSaga() {
    yield put({ type: types.SOLVE_PUZZLE })

    try {
        const grid = yield select(getGrid)
        const robots = yield select(getRobots)
        const selectedRobotName = yield select(state => state.boards.selectedRobot)

        const goalCell = Object.values(grid).find(cell => cell.goal)
        if (!goalCell) {
            yield put({ type: types.SOLVE_PUZZLE_ERROR })
            return
        }

        if (!selectedRobotName || !robots[selectedRobotName]) {
            yield put({ type: types.SOLVE_PUZZLE_ERROR })
            return
        }

        const result = solve(grid, robots, goalCell.x, goalCell.y, selectedRobotName)

        yield put({ type: types.SOLVE_PUZZLE_SUCCESS, payload: result })
    } catch (e) {
        console.error('Solver error:', e)
        yield put({ type: types.SOLVE_PUZZLE_ERROR })
    }
}

/**
 * Handle hint requests: solve on demand if needed, then show next hint
 */
export function* requestHintSaga() {
    const solverStatus = yield select(state => state.boards.solverStatus)

    if (solverStatus !== 'solved') {
        yield call(solvePuzzleSaga)
    }

    const solution = yield select(state => state.boards.solution)
    const hintIndex = yield select(state => state.boards.hintIndex)

    if (solution && hintIndex < solution.length - 1) {
        yield put({ type: types.SHOW_NEXT_HINT })
    }
}

export function* updateRobotPath({payload}) {
    const grid = yield select(getGrid)

    const robots = yield select(getRobots)
    const selectedRobot = robots[payload]

    if (!selectedRobot) return

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

        while(newY >= 0) {
            const newCell = grid[`${x},${newY}`]

            if(!done && y !== newY && newCell.robot) {
                up = up.slice(1)
                done = true
            }

            if(!done && (newCell.walls === WALL.NORTH || newCell.walls === WALL.NORTH_WEST || newCell.walls === WALL.NORTH_EAST)) {
                up.push({x, y: newY})
                done = true
            }

            if((!done && y !== newY) && (newCell.walls === WALL.SOUTH || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.SOUTH_WEST || newCell.walls === WALL.ALL)) {
                up = up.slice(1)
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

        while(newY <= Y_MAX) {
            const newCell = grid[`${x},${newY}`]

            if(!done && y !== newY && newCell.robot) {
                down = down.slice(0, down.length)
                done = true
            }

            if((!done && y !== newY) && (newCell.walls === WALL.NORTH || newCell.walls === WALL.NORTH_EAST || newCell.walls === WALL.NORTH_WEST || newCell.walls === WALL.ALL)) {
                down = down.slice(0, down.length > 1 ? down.length : 0)
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

        while(newX >= 0) {
            const newCell = grid[`${newX},${y}`]

            if(!done && x !== newX && newCell.robot) {
                left = left.slice(1)
                done = true
            }

            if(!done && (newCell.walls === WALL.WEST || newCell.walls === WALL.NORTH_WEST || newCell.walls === WALL.SOUTH_WEST)) {
                if(x !== newX) {
                    left.push({x: newX, y})
                }
                done = true
            }

            if((!done && x !== newX) && (newCell.walls === WALL.EAST || newCell.walls === WALL.SOUTH_EAST || newCell.walls === WALL.NORTH_EAST || newCell.walls === WALL.ALL)) {
                left = left.slice(1)
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

        while(newX <= X_MAX) {
            const newCell = grid[`${newX},${y}`]

            if(!done && x !== newX && (newCell.robot || newCell.walls === WALL.ALL)) {
                right = right.slice(0, right.length > 1 ? right.length : 0)
                done = true
            }

            if((!done && x !== newX) && (newCell.walls === WALL.WEST || newCell.walls === WALL.SOUTH_WEST || newCell.walls === WALL.NORTH_WEST)) {
                right = right.slice(0, right.length > 1 ? right.length : 0)
                done = true
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

    return {
        up,
        down,
        left,
        right,
    }
}

export function* moveUp() {
    const selectedRobot = yield select(getSelectedRobot)
    if (!selectedRobot) return

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
    if (!selectedRobot) return

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
    if (!selectedRobot) return

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
    if (!selectedRobot) return

    const {robot, x, y} = selectedRobot
    const { right } = yield select(getRobotPath)

    if(right && right.length > 0) {
        const moveCoord = right[right.length-1]

        yield put({type: types.MOVE_SUCCESS, payload: { oldX: x, oldY: y, newX: moveCoord.x, newY: moveCoord.y, robot: robot, direction: 'RIGHT'}})
        yield call(updateRobotPath, { payload: robot})
    }
}

const ROBOT_ORDER = [ROBOT.RED, ROBOT.GREEN, ROBOT.BLUE, ROBOT.YELLOW]

/**
 * After each move, check if any robot is on the goal cell and handle completion
 */
export function* checkRobotCompletion() {
    const grid = yield select(getGrid)
    const robots = yield select(getRobots)
    const completedRobots = yield select(getCompletedRobots)

    const goalCell = Object.values(grid).find(cell => cell.goal)
    if (!goalCell) return

    const robotOnGoal = Object.values(robots).find(
        robot => robot.x === goalCell.x && robot.y === goalCell.y
    )

    if (robotOnGoal) {
        yield put({ type: types.COMPLETE_ROBOT, payload: robotOnGoal.robot })

        const newCompleted = [...completedRobots, robotOnGoal.robot]

        if (newCompleted.length === 4) {
            yield put({ type: types.SET_STATUS, payload: Status.WIN })
        } else {
            const nextRobot = ROBOT_ORDER.find(r => !newCompleted.includes(r))
            if (nextRobot) {
                yield put({ type: types.SELECT_ROBOT, payload: nextRobot })
            }
        }
    }
}

export const sagas = [
  takeEvery(types.SETUP_BOARD, setupBoard),
  takeEvery(types.REFRESH_BOARD, refreshBoard),
  takeEvery(types.SELECT_ROBOT, updateRobotPath),

  takeEvery(types.UPDATE_HOVER_ROBOT_PATH, updateHoverRobotPath),

  takeEvery(types.MOVE_UP, moveUp),
  takeEvery(types.MOVE_DOWN, moveDown),
  takeEvery(types.MOVE_LEFT, moveLeft),
  takeEvery(types.MOVE_RIGHT, moveRight),
  takeEvery(types.MOVE_SUCCESS, checkRobotCompletion),

  takeEvery(types.REQUEST_HINT, requestHintSaga),
]
