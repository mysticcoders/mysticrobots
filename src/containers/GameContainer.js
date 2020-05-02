import React from 'react'

import { GameBoard } from '../containers/GameBoard'

import { Column, Level, Button, Icon } from 'rbx'

import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

import { FaArrowAltCircleUp, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'


/**
 * Will contain the Retro Rockets gameboard
 */
export const GameContainer = () => {
    return (
        <Column.Group>
        
            <Column>
                <GameBoard />
            </Column>
            <Column>
                <FaArrowUp size="2em" style={{ color: 'green' }} />
                <FaArrowDown size="2em" style={{ color: 'yellow' }} />
                <FaArrowLeft size="2em" style={{ color: 'red' }} />
                <FaArrowRight size="2em" style={{ color: 'blue' }} />

                <Level>
                    <Level.Item>
                        <Button><Icon size="small"><FaArrowAltCircleUp /></Icon></Button>
                        <Button><Icon size="small"><FaArrowAltCircleDown /></Icon></Button>
                        <Button><Icon size="small"><FaArrowAltCircleLeft /></Icon></Button>
                        <Button><Icon size="small"><FaArrowAltCircleRight /></Icon></Button>
                    </Level.Item>
                </Level>
            </Column>
        </Column.Group>
    )
}



export default GameContainer