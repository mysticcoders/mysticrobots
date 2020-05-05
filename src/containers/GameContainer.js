import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useHistory } from 'react-router'

import { useHotkeys } from 'react-hotkeys-hook'

import { GameBoard } from '../containers/GameBoard'
import { FooterContainer } from '../containers/FooterContainer'

import { actions } from '../ducks/boards'

import { Column, Level, Button, Icon, Notification } from 'rbx'

import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { FaArrowAltCircleUp, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'

import { ROBOT, Status } from '../constants'

/**
 * Will contain the Retro Rockets gameboard
 */
export const GameContainer = ({goalIndex, goalColor, r, g, b, y}) => {

    const dispatch = useDispatch()

    const history = useHistory()

    const moveHistory = useSelector(state => state.boards.history)
    const status = useSelector(state => state.boards.status)

    const metadata = useSelector(state => state.boards.metadata)

    useEffect(() => {
        history.replace(`/puzzle?goalIndex=${metadata.goalIndex}&goalColor=${metadata.goalColor}&r=${metadata.r}&g=${metadata.g}&b=${metadata.b}&y=${metadata.y}`)
    }, [metadata, history])

    useEffect(()=> {

        console.log("useEffect css crap")
        const navbarHeight = document.querySelector('.navbar').scrollHeight

        // Calculate our own vmin that is pixel based
        function setVmin () {
            const min = window.innerWidth > window.innerHeight ? (window.innerHeight - navbarHeight) : window.innerWidth
            document.body.style.setProperty('--vmin-minus-header', `${min/100}px`)
            document.body.style.setProperty('--vmin-source', `${min}px`)
        }
        setVmin()
        window.addEventListener('resize', setVmin)
    }, [])

    const resetGameBoard = () => {
        dispatch(actions.clearBoard({}))
        dispatch(actions.setupBoard(metadata))
    }

    useHotkeys('1', () => status !== Status.WIN && dispatch(actions.selectRobot(ROBOT.RED)), {}, [status] )
    useHotkeys('2', () => status !== Status.WIN && dispatch(actions.selectRobot(ROBOT.GREEN)), {}, [status] )
    useHotkeys('3', () => status !== Status.WIN && dispatch(actions.selectRobot(ROBOT.BLUE)), {}, [status] )
    useHotkeys('4', () => status !== Status.WIN && dispatch(actions.selectRobot(ROBOT.YELLOW)), {}, [status] )

    useHotkeys('up', () => status !== Status.WIN && dispatch(actions.moveUp()), {}, [status])
    useHotkeys('down', () => status !== Status.WIN && dispatch(actions.moveDown()), {}, [status])
    useHotkeys('left', () => status !== Status.WIN && dispatch(actions.moveLeft()), {}, [status])
    useHotkeys('right', () => status !== Status.WIN && dispatch(actions.moveRight()), {}, [status])

    return (
        <Column.Group style={{margin: 0}}>

            <Column style={{padding: 0, margin: 0}}>
                <GameBoard goalIndex={goalIndex} goalColor={goalColor} r={r} g={g} b={b} y={y} />
            </Column>
            <Column>
                {status === 'WIN' &&
                    <Notification color="success">
                        Congratulations! You solved the grid in {moveHistory.length} moves! <Button onClick={()=>{dispatch(actions.setupBoard({}))}}>Refresh</Button>
                    </Notification>
                }
                <Column.Group multiline style={{ backgroundColor: 'black', padding: '0.25rem', paddingBottom: '0'}}>
                    <Column align="left">
                        { moveHistory.map((entry, idx) => (
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
                    </Column>
                </Column.Group>

                <Level>
                    <Level.Item align="left">
                        <Button onClick={() => { dispatch(actions.moveUp()) }}><Icon size="medium"><FaArrowAltCircleUp /></Icon></Button>
                        <Button onClick={() => { dispatch(actions.moveDown()) }}><Icon size="medium"><FaArrowAltCircleDown /></Icon></Button>
                        <Button onClick={() => { dispatch(actions.moveLeft()) }}><Icon size="medium"><FaArrowAltCircleLeft /></Icon></Button>
                        <Button onClick={() => { dispatch(actions.moveRight()) }}><Icon size="medium"><FaArrowAltCircleRight /></Icon></Button>
                        <Button onClick={() => { resetGameBoard() }}>Reset Board</Button>
                    </Level.Item>
                </Level>

                <FooterContainer />
            </Column>
        </Column.Group>
    )
}



export default GameContainer