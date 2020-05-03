import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useHotkeys } from 'react-hotkeys-hook'

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

    const history = useSelector(state => state.boards.history)

    useHotkeys('tab', () => dispatch(actions.selectNextRobot()))
    useHotkeys('up', () => dispatch(actions.moveUp()))
    useHotkeys('down', () => dispatch(actions.moveDown()))
    useHotkeys('left', () => dispatch(actions.moveLeft()))
    useHotkeys('right', () => dispatch(actions.moveRight()))

    return (
        <Column.Group>
        
            <Column>
                <GameBoard />
            </Column>
            <Column>
                <Level style={{ backgroundColor: 'black', padding: '0.75rem'}}>
                    <Level.Item align="left">
                        { history.map((entry, idx) => (
                            <React.Fragment key={idx}>
                            { entry.direction === 'UP' && (
                                <FaArrowUp size="1.5em" style={{ color: entry.robot.toLowerCase() }} />
                            )}
                            { entry.direction === 'DOWN' && (
                                <FaArrowDown size="1.5em" style={{ color: entry.robot.toLowerCase() }} />
                            )}
                            { entry.direction === 'LEFT' && (
                                <FaArrowLeft size="1.5em" style={{ color: entry.robot.toLowerCase() }} />
                            )}
                            { entry.direction === 'RIGHT' && (
                                <FaArrowRight size="1.5em" style={{ color: entry.robot.toLowerCase() }} />
                            )}
                            </React.Fragment>
                        ))}
                    </Level.Item>
                </Level>

                <Level>
                    <Level.Item align="left">
                        <Button onClick={() => { dispatch(actions.moveUp()) }}><Icon size="medium"><FaArrowAltCircleUp /></Icon></Button>
                        <Button onClick={() => { dispatch(actions.moveDown()) }}><Icon size="medium"><FaArrowAltCircleDown /></Icon></Button>
                        <Button onClick={() => { dispatch(actions.moveLeft()) }}><Icon size="medium"><FaArrowAltCircleLeft /></Icon></Button>
                        <Button onClick={() => { dispatch(actions.moveRight()) }}><Icon size="medium"><FaArrowAltCircleRight /></Icon></Button>
                    </Level.Item>
                </Level>
            </Column>
        </Column.Group>
    )
}



export default GameContainer