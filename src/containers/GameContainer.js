import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useHistory } from 'react-router'

import { useHotkeys } from 'react-hotkeys-hook'

import { GameBoard } from '../containers/GameBoard'
import { FooterContainer } from '../containers/FooterContainer'

import { actions } from '../ducks/boards'

import { Column, Level, Button, Icon, Notification, Title } from 'rbx'

import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { FaArrowAltCircleUp, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'

import { ROBOT, Status } from '../constants'

import { useInterval } from '../hooks/utils'
import ShareButtons from '../components/ShareButtons'

import numeral from 'numeral'

import queryString from 'query-string'

/**
 * Will contain the Retro Rockets gameboard
 */
export const GameContainer = ({goalIndex, goalColor, r, g, b, y, tl, tr, bl, br}) => {
    const dispatch = useDispatch()

    const history = useHistory()

    const moveHistory = useSelector(state => state.boards.history)
    const status = useSelector(state => state.boards.status)

    const metadata = useSelector(state => state.boards.metadata)

    const [timerOn, setTimerOn] = useState(true)
    const [startTime, setStartTime] = useState(new Date().valueOf())
    const [elapsedTime, setElapsedTime] = useState(0)

    useInterval(() => {
        if(timerOn) {
            setElapsedTime(new Date().valueOf() - startTime)
        }
    }, 1000)


    useEffect(() => {
        if(status === 'WIN') {
            setTimerOn(false)
        }
    }, [status])

    useEffect(() => {

        const values = {
            goalIndex: metadata.goalIndex,
            goalColor: metadata.goalColor,
            r: metadata.r,
            g: metadata.g,
            b: metadata.b,
            y: metadata.y,
            tl: metadata.tl,
            tr: metadata.tr,
            bl: metadata.bl,
            br: metadata.br
        }

        const stringified = queryString.stringify(values)
        console.log(btoa(stringified))


        history.replace(`/puzzle?${queryString.stringify(values)}`)
    }, [metadata, history])

    useEffect(()=> {
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

        setStartTime(new Date().valueOf())
        setTimerOn(true)
    }

    useHotkeys('1', () => status !== Status.WIN && dispatch(actions.selectRobot(ROBOT.RED)), {}, [status] )
    useHotkeys('2', () => status !== Status.WIN && dispatch(actions.selectRobot(ROBOT.GREEN)), {}, [status] )
    useHotkeys('3', () => status !== Status.WIN && dispatch(actions.selectRobot(ROBOT.BLUE)), {}, [status] )
    useHotkeys('4', () => status !== Status.WIN && dispatch(actions.selectRobot(ROBOT.YELLOW)), {}, [status] )

    useHotkeys('up', () => status !== Status.WIN && dispatch(actions.moveUp()), {}, [status])
    useHotkeys('down', () => status !== Status.WIN && dispatch(actions.moveDown()), {}, [status])
    useHotkeys('left', () => status !== Status.WIN && dispatch(actions.moveLeft()), {}, [status])
    useHotkeys('right', () => status !== Status.WIN && dispatch(actions.moveRight()), {}, [status])

    const renderElapsedTime = () => {
        const inSeconds = elapsedTime / 1000
        const minutes = Math.floor(inSeconds / 60)
        const seconds = Math.floor(inSeconds - (minutes * 60))

        return (
            `${numeral(minutes).format('00')}:${numeral(seconds).format('00')}`
        )
    }

    return (
        <Column.Group style={{margin: 0}}>

            <Column style={{padding: 0, margin: 0}}>
                <GameBoard goalIndex={goalIndex} goalColor={goalColor} r={r} g={g} b={b} y={y} tl={tl} tr={tr} bl={bl} br={br} />
            </Column>
            <Column>
                {status === 'WIN' &&
                    <Notification color="success">
                        Congratulations! You solved the grid in {moveHistory.length} moves! and it took you {renderElapsedTime()} to complete.
                        Share on <ShareButtons 
                            title={`I solved this puzzle in ${moveHistory.length} moves, can you do better? `}
                            shareUrl={document.location}
                        />

                    </Notification>
                }
                <Column.Group multiline style={{ backgroundColor: 'black', padding: '0.25rem', margin: '0.50rem', paddingBottom: '0'}}>
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

                <Level>
                    <Level.Item>
                        <Title>{renderElapsedTime()}</Title>
                    </Level.Item>
                    <Level.Item>
                    <ShareButtons 
                            title="Challenge me to mystic robots"
                            shareUrl={document.location}
                        />
                    </Level.Item>

                </Level>
            </Column>
        </Column.Group>
    )
}



export default GameContainer