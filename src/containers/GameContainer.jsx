import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import { useHotkeys } from 'react-hotkeys-hook'

import { GameBoard } from '../containers/GameBoard'

import { actions, getCurrentHint, getCompletedRobots } from '../ducks/boards'

import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaLightbulb } from 'react-icons/fa'
import { FaArrowAltCircleUp, FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'

import { ROBOT, Status } from '../constants'
import { ROBOT_COLOR_MAP, ROBOT_NAME_MAP, ROBOT_ICON_MAP } from '../components/RobotIcons'

import { useInterval } from '../hooks/utils'
import { getCompletionMessage } from '../solver/messages'
import RobotPanel from '../components/RobotPanel'

import numeral from 'numeral'

/**
 * Main game container with board, controls, hints, robot panel, and win feedback
 */
export const GameContainer = ({goalIndex, goalColor, r, g, b, y, config}) => {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const moveHistory = useSelector(state => state.boards.history)
    const status = useSelector(state => state.boards.status)

    const metadata = useSelector(state => state.boards.metadata)

    const solverStatus = useSelector(state => state.boards.solverStatus)
    const solution = useSelector(state => state.boards.solution)
    const currentHint = useSelector(getCurrentHint)
    const hintIndex = useSelector(state => state.boards.hintIndex)
    const completedRobots = useSelector(getCompletedRobots)
    const selectedRobot = useSelector(state => state.boards.selectedRobot)

    const accentColor = selectedRobot ? ROBOT_COLOR_MAP[selectedRobot] : 'var(--color-text-muted)'

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

    useHotkeys('1', () => status !== Status.WIN && !completedRobots.includes(ROBOT.RED) && dispatch(actions.selectRobot(ROBOT.RED)), {}, [status, completedRobots] )
    useHotkeys('2', () => status !== Status.WIN && !completedRobots.includes(ROBOT.GREEN) && dispatch(actions.selectRobot(ROBOT.GREEN)), {}, [status, completedRobots] )
    useHotkeys('3', () => status !== Status.WIN && !completedRobots.includes(ROBOT.BLUE) && dispatch(actions.selectRobot(ROBOT.BLUE)), {}, [status, completedRobots] )
    useHotkeys('4', () => status !== Status.WIN && !completedRobots.includes(ROBOT.YELLOW) && dispatch(actions.selectRobot(ROBOT.YELLOW)), {}, [status, completedRobots] )

    useHotkeys('up', () => status !== Status.WIN && dispatch(actions.moveUp()), {}, [status])
    useHotkeys('down', () => status !== Status.WIN && dispatch(actions.moveDown()), {}, [status])
    useHotkeys('left', () => status !== Status.WIN && dispatch(actions.moveLeft()), {}, [status])
    useHotkeys('right', () => status !== Status.WIN && dispatch(actions.moveRight()), {}, [status])

    useHotkeys('h', () => {
        if (status !== Status.WIN) {
            dispatch(actions.requestHint())
        }
    }, {}, [status])

    const renderElapsedTime = () => {
        const inSeconds = elapsedTime / 1000
        const minutes = Math.floor(inSeconds / 60)
        const seconds = Math.floor(inSeconds - (minutes * 60))

        return (
            `${numeral(minutes).format('00')}:${numeral(seconds).format('00')}`
        )
    }

    const renderHint = () => {
        if (!currentHint || status === Status.WIN) return null
        const HintIcon = ROBOT_ICON_MAP[currentHint.robot]
        return (
            <div className="notification is-warning" style={{ padding: '0.75rem 1rem', marginBottom: '0.5rem' }}>
                <button className="delete" onClick={() => dispatch(actions.dismissHint())}></button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {HintIcon && <HintIcon size={24} />}
                    <span style={{ fontWeight: 600 }}>
                        Move {ROBOT_NAME_MAP[currentHint.robot]} {currentHint.direction.charAt(0) + currentHint.direction.slice(1).toLowerCase()}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        (Step {hintIndex + 1} of {solution.length})
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="columns" style={{margin: 0}}>

            <div className="column" style={{padding: 0, margin: 0}}>
                <GameBoard goalIndex={goalIndex} goalColor={goalColor} r={r} g={g} b={b} y={y} config={config} />
            </div>
            <div className="column">
                <RobotPanel />

                {status === 'WIN' &&
                    <div className="notification is-success" style={{ marginBottom: '0.75rem' }}>
                        <p style={{ fontWeight: 700 }}>
                            All 4 robots home in {moveHistory.length} moves ({renderElapsedTime()}).
                        </p>
                        <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
                            {getCompletionMessage(moveHistory.length)}
                        </p>
                    </div>
                }

                {status !== Status.WIN && solverStatus === 'solving' && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Solving...</p>
                )}

                {currentHint && status !== Status.WIN && renderHint()}

                {status !== Status.WIN && hintIndex < 0 && (
                    <button
                        className="button is-warning is-small"
                        onClick={() => dispatch(actions.requestHint())}
                        style={{ marginBottom: '0.5rem' }}
                    >
                        <span className="icon"><FaLightbulb /></span>
                        <span>Hint</span>
                    </button>
                )}

                {status !== Status.WIN && hintIndex >= 0 && solution && hintIndex < solution.length - 1 && (
                    <button
                        className="button is-warning is-small"
                        onClick={() => dispatch(actions.requestHint())}
                        style={{ marginBottom: '0.5rem' }}
                    >
                        <span className="icon"><FaLightbulb /></span>
                        <span>Next Hint</span>
                    </button>
                )}

                <div className="columns is-multiline" style={{
                    backgroundColor: 'var(--color-move-history-bg)',
                    padding: '0.5rem',
                    margin: '0.50rem',
                    borderRadius: '8px',
                    borderLeft: `3px solid ${accentColor}`,
                    transition: 'border-color 0.3s ease',
                    minHeight: '2.5rem',
                }}>
                    <div className="column has-text-left">
                        { moveHistory.map((entry, idx) => (
                            <React.Fragment key={idx}>
                            { entry.direction === 'UP' && (
                                <FaArrowUp size="1.5em" style={{ color: ROBOT_COLOR_MAP[entry.robot] || entry.robot.toLowerCase() }} />
                            )}
                            { entry.direction === 'DOWN' && (
                                <FaArrowDown size="1.5em" style={{ color: ROBOT_COLOR_MAP[entry.robot] || entry.robot.toLowerCase() }} />
                            )}
                            { entry.direction === 'LEFT' && (
                                <FaArrowLeft size="1.5em" style={{ color: ROBOT_COLOR_MAP[entry.robot] || entry.robot.toLowerCase() }} />
                            )}
                            { entry.direction === 'RIGHT' && (
                                <FaArrowRight size="1.5em" style={{ color: ROBOT_COLOR_MAP[entry.robot] || entry.robot.toLowerCase() }} />
                            )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <nav className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <button className="button" style={{ borderColor: accentColor, color: accentColor, transition: 'border-color 0.3s ease, color 0.3s ease' }} onClick={() => { dispatch(actions.moveUp()) }}><span className="icon is-medium"><FaArrowAltCircleUp /></span></button>
                        </div>
                        <div className="level-item">
                            <button className="button" style={{ borderColor: accentColor, color: accentColor, transition: 'border-color 0.3s ease, color 0.3s ease' }} onClick={() => { dispatch(actions.moveDown()) }}><span className="icon is-medium"><FaArrowAltCircleDown /></span></button>
                        </div>
                        <div className="level-item">
                            <button className="button" style={{ borderColor: accentColor, color: accentColor, transition: 'border-color 0.3s ease, color 0.3s ease' }} onClick={() => { dispatch(actions.moveLeft()) }}><span className="icon is-medium"><FaArrowAltCircleLeft /></span></button>
                        </div>
                        <div className="level-item">
                            <button className="button" style={{ borderColor: accentColor, color: accentColor, transition: 'border-color 0.3s ease, color 0.3s ease' }} onClick={() => { dispatch(actions.moveRight()) }}><span className="icon is-medium"><FaArrowAltCircleRight /></span></button>
                        </div>
                        <div className="level-item">
                            <button className="button" onClick={() => { resetGameBoard() }}>Reset Board</button>
                        </div>
                    </div>
                </nav>

                <nav className="level">
                    <div className="level-item">
                        <h2 className={`title${timerOn ? ' timer-active' : ''}`} style={{
                            fontSize: '3rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            fontVariantNumeric: 'tabular-nums',
                            color: accentColor,
                            transition: 'color 0.3s ease',
                        }}>{renderElapsedTime()}</h2>
                    </div>
                </nav>
            </div>
        </div>
    )
}



export default GameContainer
