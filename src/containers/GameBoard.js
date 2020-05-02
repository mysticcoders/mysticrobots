import React from 'react'


import { GamePiece } from '../components/GamePiece'

import { Level } from 'rbx'
/**
 * Will contain the Retro Rockets gameboard
 */
export const GameBoard = () => {

    
    const rows = []

    for(let i=0; i<16; i++) {
        let occupant = undefined
        let redOccupant = undefined
        if(i === 4) {
            occupant="blue"
        }

        if(i === 10) {
            redOccupant="red"
        }
        rows.push(
            <Level key={i} style={{margin: 0}}>
                <Level.Item>
                    <GamePiece occupant={occupant} />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece occupant={redOccupant} />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                    <GamePiece />
                </Level.Item>
            </Level>
        )
    }
    return (
        <>
        { rows.map(row => (
            <>
                {row}
            </>
        ))}
        </>
    )
}



export default GameBoard