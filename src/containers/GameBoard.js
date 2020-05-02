import React from 'react'


import { GamePiece, ROBOT, WALL, GOAL } from '../components/GamePiece'

import { Level } from 'rbx'
/**
 * Will contain the Retro Rockets gameboard
 */
export const GameBoard = () => {
    const grid = []

    for(let x = 0; x<16; x++) {
        let row = []
        for(let y = 0; y<16; y++) {
            row.push({
                x,
                y,
                walls: 0,
                robot: null,
                goal: null,
            })
        }

        grid.push(row)
    }

    const setRobot = (grid, x, y, robot) => grid[x][y] = {...grid[x][y], robot}
    const setWall = (grid, x, y, wall) => grid[x][y] = {...grid[x][y], wall}
    const setGoal = (grid, x, y, goal) => grid[x][y] = {...grid[x][y], goal}

    setGoal(grid, 4, 13, GOAL.GREEN)

    // ROBOTS!
    setRobot(grid, 0, 3, ROBOT.RED)
    setRobot(grid, 12, 3, ROBOT.BLUE)
    setRobot(grid, 8, 13, ROBOT.YELLOW)
    setRobot(grid, 14, 9, ROBOT.GREEN)

    // WALLS
    setWall(grid, 1, 0, WALL.EAST)
    setWall(grid, 9, 0, WALL.EAST)

    setWall(grid, 4, 1, WALL.NORTH_WEST)
    setWall(grid, 14, 1, WALL.NORTH_WEST)

    setWall(grid, 1, 2, WALL.NORTH_EAST)
    setWall(grid, 11, 2, WALL.SOUTH_WEST)

    setWall(grid, 6, 3, WALL.SOUTH_EAST)

    setWall(grid, 0, 5, WALL.SOUTH)

    setWall(grid, 3, 6, WALL.NORTH_WEST)
    setWall(grid, 13, 6, WALL.SOUTH_EAST)

    setWall(grid, 10, 7, WALL.NORTH_EAST)

    setWall(grid, 15, 8, WALL.SOUTH)

    setWall(grid, 0, 9, WALL.SOUTH)

    setWall(grid, 3, 10, WALL.SOUTH_EAST)
    setWall(grid, 8, 10, WALL.NORTH_WEST)
    setWall(grid, 13, 10, WALL.NORTH_WEST)

    setWall(grid, 5, 11, WALL.NORTH_EAST)
    setWall(grid, 10, 11, WALL.SOUTH_EAST)

    setWall(grid, 2, 12, WALL.SOUTH_WEST)
    setWall(grid, 14, 12, WALL.SOUTH_WEST)

    setWall(grid, 4, 13, WALL.NORTH_WEST)
    setWall(grid, 9, 14, WALL.NORTH_EAST)

    setWall(grid, 3, 15, WALL.EAST)
    setWall(grid, 11, 15, WALL.EAST)

    // CENTER which is immovable!
    setWall(grid, 7, 7, WALL.ALL)
    setWall(grid, 7, 8, WALL.ALL)
    setWall(grid, 8, 8, WALL.ALL)
    setWall(grid, 8, 7, WALL.ALL)


    return (
        <div style={{ border: '5px solid #000', width: '618px'}}>
        { grid.map((row, y) => (
            <Level key={y} style={{margin: 0}}>
                <Level.Item>
                { row.map((cell, x) => (
                    <GamePiece key={`${x}-${y}`} gridCell={grid[x][y]} />
                ))}
                </Level.Item>                
            </Level>
        ))}
        </div>
    )
}



export default GameBoard