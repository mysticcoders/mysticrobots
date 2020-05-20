const utils = require('./utils')
const { WALL, GOAL, ROBOT } = require('./constants')

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

/**
 * 
 * @param {*} param0 
 */
function setupBoard({ grid, config }) {

    const randomBoard = () => {
        return [utils.randomIntFromInterval(0,3), utils.randomIntFromInterval(0,3), utils.randomIntFromInterval(0,3), utils.randomIntFromInterval(0,3)].join('')
    }

    let boardPayload = config && config.length === 4 ? config : randomBoard()
    let boardSplit = boardPayload.split('').map(entry => Number(entry))

    if(boardSplit[0] < 0 || boardSplit[0] > 3 ||
        boardSplit[1] < 0 || boardSplit[1] > 3 ||
        boardSplit[2] < 0 || boardSplit[2] > 3 ||
        boardSplit[3] < 0 || boardSplit[3] > 3) {
        
        console.log("received bad payload")
        boardPayload = randomBoard()
        boardSplit = boardPayload.split('').map(entry => Number(entry))
    }

    let boardTL = this['classic']['RED'][boardSplit[0]]
    let boardTR = this['classic']['GREEN'][boardSplit[1]]
    let boardBL = this['classic']['YELLOW'][boardSplit[2]]
    let boardBR = this['classic']['BLUE'][boardSplit[3]]

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

    return {
        config: boardPayload
    }
}

const setGoal = (grid, x, y, goal) => grid[`${x},${y}`] = {...grid[`${x},${y}`], goal}

function setupGoal({ grid, goalIndex, goalColor }) {

    const corners = Object.values(grid).filter(element => element.walls === WALL.NORTH_WEST || element.walls === WALL.NORTH_EAST || element.walls === WALL.SOUTH_WEST || element === WALL.SOUTH_EAST)

    const randomGoalIndex = goalIndex >= 0 && goalIndex < corners.length ? goalIndex : utils.randomIntFromInterval(0, corners.length - 1)
    const randomCorner = corners[randomGoalIndex]

    const goals = Object.values(GOAL)

    const goalColorIndex = goalColor >= 0 && goalColor < goals.length ? goalColor : utils.randomIntFromInterval(0, goals.length - 1)
    const randomGoalColor = goals[goalColorIndex]    

    setGoal(grid, randomCorner.x, randomCorner.y, randomGoalColor)

    return {
        x: randomCorner.x,
        y: randomCorner.y,
        goalIndex: randomGoalIndex,
        goalColor: goalColorIndex
    }
}

const setRobot = (grid, x, y, robot) => grid[`${x},${y}`] = {...grid[`${x},${y}`], robot}

function setupRobots({ grid, r, g, b, y}) {

    let availableSpots = Object.values(grid).filter(element => element.walls !== WALL.ALL && !element.goal && !element.robot)

    const rIndex = r >= 0 && r < availableSpots.length ? r : utils.randomIntFromInterval(0, availableSpots.length - 1)
    const redLocation = availableSpots[rIndex]
    setRobot(grid, redLocation.x, redLocation.y, ROBOT.RED)
    availableSpots.splice(rIndex, 1)

    const gIndex = g >= 0 && g < availableSpots.length ? g : utils.randomIntFromInterval(0, availableSpots.length - 1)
    const greenLocation = availableSpots[gIndex]
    setRobot(grid, greenLocation.x, greenLocation.y, ROBOT.GREEN)
    availableSpots.splice(gIndex, 1)

    const bIndex = b >= 0 && b < availableSpots.length ? b : utils.randomIntFromInterval(0, availableSpots.length - 1)
    const blueLocation = availableSpots[bIndex]
    setRobot(grid, blueLocation.x, blueLocation.y, ROBOT.BLUE)
    availableSpots.splice(bIndex, 1)

    const yIndex = y >= 0 && y < availableSpots.length ? y : utils.randomIntFromInterval(0, availableSpots.length - 1)
    const yellowLocation = availableSpots[yIndex]
    setRobot(grid, yellowLocation.x, yellowLocation.y, ROBOT.YELLOW)
    availableSpots.splice(yIndex, 1)
    
    return {
        rIndex,
        gIndex,
        bIndex,
        yIndex,
        redLocation,
        greenLocation,
        blueLocation,
        yellowLocation,
    }
}

const X_MIN = 0
const Y_MIN = 0
const X_MAX = 15
const Y_MAX = 15

function illuminateThePath({grid, selectedRobot}) {
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
    setupBoard,
    setupGoal,
    setupRobots,
    illuminateThePath,
}