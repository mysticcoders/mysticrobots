import React from 'react'


import { GamePiece, ROBOT } from '../components/GamePiece'

import { Level } from 'rbx'
/**
 * Will contain the Retro Rockets gameboard
 */
export const GameBoard = () => {

    

    const grid = []

    for(let x = 0; x<16; x++) {
        grid.push(new Array(16).fill({
            walls: 0,
            robot: null,
            goal: null,
        }))        
    }

    console.dir(grid)

    grid[4][8] = { ...grid[4][8], robot: ROBOT.BLUE}
    grid[7][8] = { ...grid[7][8], robot: ROBOT.RED}
    grid[14][10] = { ...grid[14][10], robot: ROBOT.YELLOW}
    grid[2][2] = { ...grid[2][2], robot: ROBOT.GREEN}

    return (
        <div style={{ border: '5px solid #000', width: '618px'}}>
        { grid.map((row, y) => (
            <Level key={y} style={{margin: 0}}>
                <Level.Item>
                { row.map((cell, x) => (
                    <GamePiece gridCell={grid[x][y]} />
                ))}
                </Level.Item>                
            </Level>
        ))}
        </div>
    )
}



export default GameBoard