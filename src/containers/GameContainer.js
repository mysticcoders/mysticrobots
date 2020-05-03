import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { GameBoard } from '../containers/GameBoard'

import { actions } from '../ducks/boards'

import { Column, Level, Button, Icon } from 'rbx'

import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { FaArrowAltCircleUp, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'


/**
 * Will contain the Retro Rockets gameboard
 */
export const GameContainer = () => {

    const dispatch = useDispatch()

    const greenRobot = useSelector(state => state.boards.robots.GREEN)
    const redRobot = useSelector(state => state.boards.robots.RED)
    const yellowRobot = useSelector(state => state.boards.robots.YELLOW)
    const blueRobot = useSelector(state => state.boards.robots.BLUE)

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

                <Level style={{ backgroundColor: 'black', padding: '0.75rem'}}>
                    <Level.Item align="left">
                        <FaArrowUp size="1.5em" style={{ color: 'green' }} />
                    </Level.Item>
                </Level>

                <Level>
                    <Level.Item align="left">
                        <Button onClick={() => { dispatch(actions.moveUp(blueRobot)) }}><Icon size="medium"><FaArrowAltCircleUp /></Icon></Button>
                        <Button onClick={() => { dispatch(actions.moveDown(blueRobot)) }}><Icon size="medium"><FaArrowAltCircleDown /></Icon></Button>
                        <Button onClick={() => { dispatch(actions.moveLeft(blueRobot)) }}><Icon size="medium"><FaArrowAltCircleLeft /></Icon></Button>
                        <Button onClick={() => { dispatch(actions.moveRight(blueRobot)) }}><Icon size="medium"><FaArrowAltCircleRight /></Icon></Button>
                    </Level.Item>
                </Level>
            </Column>
        </Column.Group>
    )
}



export default GameContainer