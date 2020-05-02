import React from 'react'

export const WALL = {
    NONE: null,
    NORTH_WEST: 'NORTH_WEST',
    SOUTH_WEST: 'SOUTH_WEST',
    SOUTH_EAST: 'SOUTH_EAST',
    NORTH: 'NORTH',
    EAST: 'EAST',
    SOUTH: 'SOUTH',
    WEST: 'WEST'
}

export const ROBOT = {
    NONE: null,
    RED: 'RED',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    YELLOW: 'YELLOW'
}

export const GOAL = {
    NONE: null,
    RED: 'RED',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    YELLOW: 'YELLOW'
}

/**
 * Will contain the Retro Rockets gameboard
 */
export const GamePiece = ({ gridCell }) => {

    const Robot = () => (
        <div style={{ width: '25px', height: '25px', margin: '5px', background: gridCell.robot.toLowerCase(), borderRadius: '50%' }}>&nbsp;</div>
    )
    
    const Goal = () => (
        <div style={{ width: '25px', height: '25px', margin: '5px', background: gridCell.goal.toLowerCase(), borderRadius: '20%' }}>&nbsp;</div>
    )

    return (
        <div style={{ width: '38px', height: '38px', border: '1px solid #000', backgroundColor: 'rgba(226, 206, 170, 1)'}}>
            { gridCell.robot && 
                <Robot />
            }
            
        </div>
    )
}


export default GamePiece