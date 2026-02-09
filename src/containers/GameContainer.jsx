import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import { useHotkeys } from 'react-hotkeys-hook'

import { GameBoard } from '../containers/GameBoard'

import { actions } from '../ducks/boards'

import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { FaArrowAltCircleUp, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'

import { ROBOT, Status } from '../constants'

import { useInterval } from '../hooks/utils'
import ShareButtons from '../components/ShareButtons'

import numeral from 'numeral'

/**
 * Will contain the Retro Rockets gameboard
 */
export const GameContainer = ({goalIndex, goalColor, r, g, b, y, config}) => {
    const dispatch = useDispatch()

    const navigate = useNavigate()

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

        const params = new URLSearchParams({
            goalIndex: metadata.goalIndex,
            goalColor: metadata.goalColor,
            r: metadata.r,
            g: metadata.g,
            b: metadata.b,
            y: metadata.y,
            config: metadata.config,
        })

        navigate(`/puzzle?${params.toString()}`, { replace: true })
    }, [metadata, navigate])

    useEffect(()=> {
        const navbarHeight = document.querySelector('.navbar').scrollHeight

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
        <div className="columns" style={{margin: 0}}>

            <div className="column" style={{padding: 0, margin: 0}}>
                <GameBoard goalIndex={goalIndex} goalColor={goalColor} r={r} g={g} b={b} y={y} config={config} />
            </div>
            <div className="column">
                {status === 'WIN' &&
                    <div className="notification is-success">
                        Congratulations! You solved the grid in {moveHistory.length} moves! and it took you {renderElapsedTime()} to complete.
                        Share on <ShareButtons
                            title={`I solved this puzzle in ${moveHistory.length} moves, can you do better? `}
                            shareUrl={document.location}
                        />

                    </div>
                }
                <div className="columns is-multiline" style={{ backgroundColor: 'black', padding: '0.25rem', margin: '0.50rem', paddingBottom: '0'}}>
                    <div className="column has-text-left">
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
                    </div>
                </div>

                <nav className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <button className="button" onClick={() => { dispatch(actions.moveUp()) }}><span className="icon is-medium"><FaArrowAltCircleUp /></span></button>
                        </div>
                        <div className="level-item">
                            <button className="button" onClick={() => { dispatch(actions.moveDown()) }}><span className="icon is-medium"><FaArrowAltCircleDown /></span></button>
                        </div>
                        <div className="level-item">
                            <button className="button" onClick={() => { dispatch(actions.moveLeft()) }}><span className="icon is-medium"><FaArrowAltCircleLeft /></span></button>
                        </div>
                        <div className="level-item">
                            <button className="button" onClick={() => { dispatch(actions.moveRight()) }}><span className="icon is-medium"><FaArrowAltCircleRight /></span></button>
                        </div>
                        <div className="level-item">
                            <button className="button" onClick={() => { resetGameBoard() }}>Reset Board</button>
                        </div>
                    </div>
                </nav>

                <nav className="level">
                    <div className="level-item">
                        <h2 className="title">{renderElapsedTime()}</h2>
                    </div>
                    <div className="level-item">
                    <ShareButtons
                            title="Challenge me to mystic robots"
                            shareUrl={document.location}
                        />
                    </div>

                </nav>
            </div>
        </div>
    )
}



export default GameContainer
