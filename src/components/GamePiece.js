import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { actions } from '../ducks/boards'

import { WALL, ROBOT } from '../constants'

/**
 * Will contain the Retro Rockets gameboard
 */
export const GamePiece = ({ gridCell, isInRobotPath = false }) => {

    const dispatch = useDispatch()
    
    const selectedRobot = useSelector(state => state.boards.selectedRobot)

    const theSelectedRobot = useSelector(state => state.boards.robots[selectedRobot])

    if(!gridCell) {
        return null
    }

    const Robot = () => (
        <div style={{ width: '75%', height: '75%', margin: '12.5%', background: gridCell.robot.toLowerCase(), borderRadius: '50%' }}>&nbsp;</div>
    )
    
    let backgroundColor = 'rgba(226, 206, 170, 1)'

    let wallBorder = "1px"

    if(gridCell.walls) {
        if(gridCell.walls === WALL.NORTH_WEST) {
            wallBorder = "5px 1px 1px 5px"
        } else if(gridCell.walls === WALL.NORTH_EAST) {
            wallBorder = "5px 5px 1px 1px"
        } else if(gridCell.walls === WALL.SOUTH_WEST) {
            wallBorder = "1px 1px 5px 5px"
        } else if(gridCell.walls === WALL.SOUTH_EAST) {
            wallBorder = "1px 5px 5px 1px"
        } else if(gridCell.walls === WALL.NORTH) {
            wallBorder = "5px 1px 1px 1px"
        } else if(gridCell.walls === WALL.EAST) {
            wallBorder = "1px 5px 1px 1px"
        } else if(gridCell.walls === WALL.SOUTH) {
            wallBorder = "1px 1px 5px 1px"
        } else if(gridCell.walls === WALL.WEST) {
            wallBorder = "1px 1px 1px 5px"
        } else {
            wallBorder = "5px 5px 5px 5px"
        }
    }

    const handleClick = () => {
        if(gridCell.robot) {
            dispatch(actions.selectRobot(gridCell.robot))
        } else if(isInRobotPath) {
            if(gridCell.x < theSelectedRobot.x) {
                dispatch(actions.moveLeft())
            } else if(gridCell.x > theSelectedRobot.x) {
                dispatch(actions.moveRight())
            } else if(gridCell.y < theSelectedRobot.y) {
                dispatch(actions.moveUp())
            } else if(gridCell.y > theSelectedRobot.y) {
                dispatch(actions.moveDown())
            }
        }
        console.log(gridCell)        
    }

    const pieceStyle = { 
        width: `calc( 6.25 * var(--vmin-minus-padding) )`, 
        height: `calc( 6.25 * var(--vmin-minus-padding) )`, 
        display: 'block',
        borderWidth: wallBorder, 
        borderStyle: "solid",  
        borderColor: "#000", 
        backgroundColor: backgroundColor
    }

    if(gridCell.robot && gridCell.robot === selectedRobot) {

        if(gridCell.robot === ROBOT.BLUE) {
            pieceStyle.backgroundColor = "rgba(0, 0, 255, 0.2)"
        } else if(gridCell.robot === ROBOT.RED) {
            pieceStyle.backgroundColor = "rgba(255, 0, 0, 0.2)"            
        } else if(gridCell.robot === ROBOT.GREEN) {
            pieceStyle.backgroundColor = "rgba(0, 255, 0, 0.2)"
        } else if(gridCell.robot === ROBOT.YELLOW) {
            pieceStyle.backgroundColor = "rgba(255, 255, 0, 0.2)"
        }
    }

    if(isInRobotPath) {

        if(selectedRobot === ROBOT.BLUE) {
            pieceStyle.backgroundColor = "rgba(0, 0, 255, 0.2)"
        } else if(selectedRobot === ROBOT.RED) {
            pieceStyle.backgroundColor = "rgba(255, 0, 0, 0.2)"            
        } else if(selectedRobot === ROBOT.GREEN) {
            pieceStyle.backgroundColor = "rgba(0, 255, 0, 0.2)"
        } else if(selectedRobot === ROBOT.YELLOW) {
            pieceStyle.backgroundColor = "rgba(255, 255, 0, 0.2)"
        }
    }

    if(gridCell.goal) {
        pieceStyle.backgroundColor = gridCell.goal.toLowerCase()
    }

    if(gridCell.robot) {
        pieceStyle.cursor = 'pointer'
    }

    return (
        <div onClick={() => { handleClick() }} style={pieceStyle}>
            { gridCell.robot && 
                <Robot />
            }
            
        </div>
    )
}


export default GamePiece