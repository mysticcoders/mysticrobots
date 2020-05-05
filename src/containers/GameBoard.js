import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { GamePiece } from '../components/GamePiece'

import { actions } from '../ducks/boards'

import { Level } from 'rbx'
/**
 * Will contain the Retro Rockets gameboard
 */
export const GameBoard = ({goalIndex, goalColor, r, g, b, y}) => {

    const dispatch = useDispatch()

    const [displayGrid, setDisplayGrid] = useState(null)

    useEffect(() => {
        dispatch(actions.setupBoard({goalIndex, goalColor, r, g, b, y}))
    }, [dispatch])

    const grid = useSelector(state => state.boards.grid)

    const selectedRobotPath = useSelector(state => state.boards.selectedRobotPath)


    const isInRobotPath = (x, y) => {
        if(!selectedRobotPath) return false

        const allPaths = [].concat(selectedRobotPath.left, selectedRobotPath.right, selectedRobotPath.up, selectedRobotPath.down)
        const coords = allPaths.reduce((obj, item) => {
            obj.push(`${item.x},${item.y}`)
            return obj
        }, [])
        
        return (coords.indexOf(`${x},${y}`) !== -1)
    }

    useEffect(() => {
        if(grid && Object.keys(grid).length > 0) {

            let g = []
            for(let x=0; x<16; x++) {
                const row = []
                for(let y=0; y<16; y++) {
                    row.push(grid[`${x},${y}`])
                }

                g.push(row)
            }

            setDisplayGrid(g)
        }

    }, [grid])

    if(!displayGrid) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div style={{ border: '5px solid #000', width: '100vmin', height: '100vmin'}}>
        { displayGrid.map((row, y) => (
            <Level key={y} style={{margin: 0}}>
                <Level.Item>
                { row.map((cell, x) => (
                    <GamePiece key={`${x}-${y}`} gridCell={displayGrid[x][y]} isInRobotPath={isInRobotPath(x, y)} />
                ))}
                </Level.Item>                
            </Level>
        ))}
        </div>
    )
}



export default GameBoard