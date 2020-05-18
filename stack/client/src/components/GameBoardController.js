import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useHotkeys } from 'react-hotkeys-hook'

import { actions } from '../ducks/boards'

import { Button, Level, Title, Notification, Column, Icon } from 'rbx'
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { FaArrowAltCircleUp, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'


import { useInterval } from '../hooks/utils'

import { Status, ROBOT } from 'common'
import ShareButtons from '../components/ShareButtons'
import numeral from 'numeral'

export const GameBoardController = () => {

    const dispatch = useDispatch()

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
        if(status === Status.WIN) {
            setTimerOn(false)
        }
    }, [status])


    const resetGameBoard = () => {
        dispatch(actions.clearBoard({}))
        dispatch(actions.setupBoard(metadata))

        setStartTime(new Date().valueOf())
        setTimerOn(true)
    }

    const renderElapsedTime = () => {
        const inSeconds = elapsedTime / 1000
        const minutes = Math.floor(inSeconds / 60)
        const seconds = Math.floor(inSeconds - (minutes * 60))

        return (
            `${numeral(minutes).format('00')}:${numeral(seconds).format('00')}`
        )
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
        <>
            {status === Status.WIN &&
                <Notification color="success">
                    Congratulations! You solved the grid in {moveHistory.length} moves! and it took you {renderElapsedTime()} to complete.
                    Share on <ShareButtons 
                                title={`I solved this puzzle in ${moveHistory.length} moves, can you do better? `} shareUrl={document.location} />

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
        </>     
    )

}

export default GameBoardController