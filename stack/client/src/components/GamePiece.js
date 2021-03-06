import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { actions } from '../ducks/boards'

import { FaRobot, FaStar } from 'react-icons/fa'

import { WALL, ROBOT } from 'common'

/**
 * Will contain the Retro Rockets gameboard
 */
export const GamePiece = ({ gridCell, isInRobotPath = false, isHoveringInRobotPath = false }) => {

    const dispatch = useDispatch()
    
    const selectedRobot = useSelector(state => state.boards.selectedRobot)
    const hoverRobot = useSelector(state => state.boards.hoverRobot)

    const theSelectedRobot = useSelector(state => state.boards.robots[selectedRobot])
    // const theHoverRobot = useSelector(state => hoverRobot && state.boards.robots[hoverRobot])

    if(!gridCell) {
        return null
    }

    const GoalWithRobot = () => (
        <div style={{ backgroundColor: gridCell.goal.toLowerCase() }}>
            <FaRobot style={{ display: 'inline', width: '75%', height: '75%', margin: '12.5%', color: gridCell.robot.toLowerCase()}} />
        </div>
    )

    const Robot = () => (
        <FaRobot style={{ width: '75%', height: '75%', margin: '12.5%', color: gridCell.robot.toLowerCase()}} />
    )

    const Goal = () => (
        <div>
            <FaStar style={{ width: '75%', height: '75%', margin: '12.5%', color: gridCell.goal.toLowerCase() }} />
        </div>
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

        console.log(gridCell)   // DEBUG print of cell when clicked on
    }

    const handleOnMouseEnter = () => {
        if(gridCell.robot) {
            dispatch(actions.updateHoverRobotPath(gridCell.robot))
        }
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

    if(isHoveringInRobotPath) {

        // TODO this looks wonky if we end up hovering and then moving that hover. fix styling.
        if(hoverRobot === ROBOT.BLUE) {
            pieceStyle.backgroundColor = "rgba(0, 0, 255, 0.2)"
        } else if(hoverRobot === ROBOT.RED) {
            pieceStyle.backgroundColor = "rgba(255, 0, 0, 0.2)"            
        } else if(hoverRobot === ROBOT.GREEN) {
            pieceStyle.backgroundColor = "rgba(0, 255, 0, 0.2)"
        } else if(hoverRobot === ROBOT.YELLOW) {
            pieceStyle.backgroundColor = "rgba(255, 255, 0, 0.2)"
        }
    }

    if(gridCell.robot) {
        pieceStyle.cursor = 'pointer'
    }

    return (
        <div onClick={() => { handleClick() }} onMouseEnter={()=> { handleOnMouseEnter() }} onMouseLeave={() => { dispatch(actions.clearHoverRobotPath()) }} style={pieceStyle}>
            <>
                { (gridCell.robot && gridCell.goal) &&
                    <GoalWithRobot />
                }
                { (gridCell.robot && !gridCell.goal) && 
                    <Robot />
                }
                { (gridCell.goal && !gridCell.robot) &&
                    <Goal />
                }
            </>
            
        </div>
    )
}


export default GamePiece