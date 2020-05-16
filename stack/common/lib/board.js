const utils = require('./utils')
const { WALL, GOAL } = require('./constants')

/**
 * Given a board and a location process and send back
 * in correct orientation
 * 
 * (TL = Top Left)
 * (TR = Top Right)
 * (BL = Bottom Left)
 * (BR = Bottom Right)
 * 
 * @param {*} board 
 * @param {*} location 
 */
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
            newBoard = utils.rotate(newBoard, 2)
        } else if(location === 'TR') {
            newBoard = utils.rotate(newBoard, 3)
        } else if(location === 'BL') {
            newBoard = utils.rotate(newBoard)
        } 
    } else if(centerSquare === 2) {
        if(location === 'TL') {
            newBoard = utils.rotate(newBoard)
        } else if(location === 'TR') {
            newBoard = utils.rotate(newBoard, 2)
        } else if(location === 'BR') {
            newBoard = utils.rotate(newBoard, 3)
        }
    } else if(centerSquare === 3) {
        if(location === 'TL') {
            newBoard = utils.rotate(newBoard, 3)
        } else if(location === 'BL') {
            newBoard = utils.rotate(newBoard, 2)
        } else if(location === 'BR') {
            newBoard = utils.rotate(newBoard)
        }
    } else if(centerSquare === 4) {
        if(location === 'TR') {
            newBoard = utils.rotate(newBoard)
        } else if(location === 'BL') {  
            newBoard = utils.rotate(newBoard, 3)
        } else if(location === 'BR') {
            newBoard = utils.rotate(newBoard, 2)
        }
    }

    return newBoard
}

function setupGoal({ grid, goalIndex, goalColor }) {

    const corners = Object.values(grid).filter(element => element.walls === WALL.NORTH_WEST || element.walls === WALL.NORTH_EAST || element.walls === WALL.SOUTH_WEST || element === WALL.SOUTH_EAST)

    const randomGoalIndex = goalIndex >= 0 && goalIndex < corners.length ? goalIndex : utils.randomIntFromInterval(0, corners.length - 1)
    const randomCorner = corners[randomGoalIndex]

    const goals = Object.values(GOAL)

    const goalColorIndex = goalColor >= 0 && goalColor < goals.length ? goalColor : utils.randomIntFromInterval(0, goals.length - 1)
    const randomGoalColor = goals[goalColorIndex]    

    return {
        x: randomCorner.x,
        y: randomCorner.y,
        goalIndex: goalColorIndex,
        goalColor: randomGoalColor
    }
}

// Red Boards
const RED_BOARD_1 = [
    ['','','','','E','','',''],
    ['','','','','','','',''],
    ['','','','SE','','','',''],
    ['','','','NW','','','',''],
    ['','','','','','','','S'],
    ['','NE','','','','','',''],
    ['','','','','','SW','',''],
    ['X','','','','','','',''],
]

const RED_BOARD_2 = [
    ['','','','E','','','',''],
    ['','SW','','','','','',''],
    ['','','','','','','NE',''],
    ['','','','','','','',''],
    ['','','SE','','','','',''],
    ['S','','','','','','','NW'],
    ['','','','','','','',''],
    ['','','','','','','','X'],
]

const RED_BOARD_3 = [
    ['','','E','','','','',''],
    ['','NE','','','','','',''],
    ['','','','SE','','','',''],
    ['','','','','','','','S'],
    ['','','','','','','',''],
    ['','','','','','SW','',''],
    ['','','','','','','',''],
    ['X','','NW','','','','',''],
]

const RED_BOARD_4 = [
    ['','E','','','','','',''],
    ['','','','','NE','','',''],
    ['','','','','','','',''],
    ['','SW','','','','','',''],
    ['','','','','','','',''],
    ['S','','','','','NW','',''],
    ['','','','SE','','','',''],
    ['','','','','','','','X'],
]

// Green Boards
const GREEN_BOARD_1 = [
    ['','E','','','','','',''],
    ['','','','NW','','','',''],
    ['','','','','','','',''],
    ['','','','','','','SE',''],
    ['','SW','','','','','',''],
    ['','','','','','','',''],
    ['S','','','','NE','','',''],
    ['','','','','','','','X'],
]

const GREEN_BOARD_2 = [
    ['','E','','','','','',''],
    ['','','','','NE','','',''],
    ['','SE','','','','','',''],
    ['','NW','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','','S'],
    ['','','','SW','','','',''],
    ['X','','','','','','',''],
]

const GREEN_BOARD_3 = [
    ['','E','','','','','',''],
    ['','','','','','NE','',''],
    ['','','','','','','',''],
    ['','NW','','','','','',''],
    ['','','','','','','','S'],
    ['','','','','','','',''],
    ['','','SE','','','','SW',''],
    ['X','','','','','','',''],
]

const GREEN_BOARD_4 = [
    ['','E','','','','','',''],
    ['','','','NW','','','',''],
    ['','','','','','','',''],
    ['','','','','','','SE',''],
    ['','SW','','','','','',''],
    ['','','','','','','',''],
    ['S','','','','NE','','',''],
    ['','','','','','','','X'],
]

// Yellow Boards
const YELLOW_BOARD_1 = [
    ['X','','','','NW','','',''],
    ['','','SW','','','','',''],
    ['','','','','','','','S'],
    ['','SE','','','','','',''],
    ['','','','','','','NE',''],
    ['','','','','','','',''],
    ['','','','','','NW','',''],
    ['','','E','','','','',''],
]

const YELLOW_BOARD_2 = [
    ['','','','','','','','X'],
    ['','','SW','','','','',''],
    ['S','','','','','','','NE'],
    ['','','','','','','',''],
    ['','','','SE','','','',''],
    ['','','','NW','','','',''],
    ['','','','','','NE','',''],
    ['','','','','','','','W'],
]

const YELLOW_BOARD_3 = [
    ['X','','','','','','',''],
    ['','','','','','','SW',''],
    ['','SE','','','','','',''],
    ['','','','','NW','','','S'],
    ['','','','','','','',''],
    ['NW','','','','','','',''],
    ['','','NE','','','','',''],
    ['','','','','E','','',''],
]

const YELLOW_BOARD_4 = [
    ['','','','','','NE','','X'],
    ['','SE','','','','','',''],
    ['','','','','SW','','',''],
    ['S','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','NE','',''],
    ['','','','NW','','','',''],
    ['','','','','','','E',''],
]

// Blue Boards
const BLUE_BOARD_1 = [
    ['','','E','','','','',''],
    ['','','','','','','',''],
    ['','','','','','S','NW',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','SW','','','','','',''],
    ['S','','','','','','',''],
    ['','','','','NE','','','X'],
]

const BLUE_BOARD_2 = [
    ['','','','','','','','X'],
    ['','','','','SW','','',''],
    ['','NE','','','','','',''],
    ['S','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','NW',''],
    ['','','SE','','','','',''],
    ['','','','E','','','',''],
]

const BLUE_BOARD_3 = [
    ['','','','','','','','X'],
    ['S','','','','','','',''],
    ['','','','SE','','','',''],
    ['','','','','','NE','',''],
    ['','','SW','','','','',''],
    ['','','','','NE','','',''],
    ['','','','','','','',''],
    ['','','','','W','','',''],
]

const BLUE_BOARD_4 = [
    ['','','','','E','','',''],
    ['','','NW','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','SW',''],
    ['S','','','','','','',''],
    ['','','','','NE','','',''],
    ['','SE','','','','','',''],
    ['','','','','','','','X'],
]


module.exports = { 
    'classic': {
        'RED': [ RED_BOARD_1, RED_BOARD_2, RED_BOARD_3, RED_BOARD_4 ],
        'GREEN': [ GREEN_BOARD_1, GREEN_BOARD_2, GREEN_BOARD_3, GREEN_BOARD_4 ],
        'YELLOW': [ YELLOW_BOARD_1, YELLOW_BOARD_2, YELLOW_BOARD_3, YELLOW_BOARD_4 ],
        'BLUE': [ BLUE_BOARD_1, BLUE_BOARD_2, BLUE_BOARD_3, BLUE_BOARD_4 ],
    },
    processBoard,
    setupGoal,
}