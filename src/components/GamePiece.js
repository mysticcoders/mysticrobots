import React from 'react'

import { WALL, ROBOT, GOAL } from '../constants'

/**
 * Will contain the Retro Rockets gameboard
 */
export const GamePiece = ({ gridCell }) => {

    if(!gridCell) {
        return null
    }

    const Robot = () => (
        <div style={{ width: '25px', height: '25px', margin: '5px', background: gridCell.robot.toLowerCase(), borderRadius: '50%' }}>&nbsp;</div>
    )
    
    let backgroundColor = 'rgba(226, 206, 170, 1)'

    if(gridCell.goal) {
        backgroundColor = gridCell.goal.toLowerCase()
    }

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
            console.log(gridCell)
        }
    }

    const pieceStyle = { 
        width: '38px', 
        height: '38px', 
        borderWidth: wallBorder, 
        borderStyle: "solid",  
        borderColor: "#000", 
        backgroundColor: backgroundColor
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