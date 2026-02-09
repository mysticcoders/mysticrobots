import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ROBOT, Status } from '../constants'
import { actions, getCompletedRobots } from '../ducks/boards'
import { ROBOT_ICON_MAP, ROBOT_NAME_MAP, ROBOT_COLOR_MAP } from './RobotIcons'

const ROBOT_KEYS = [
    { key: ROBOT.RED, shortcut: '1' },
    { key: ROBOT.GREEN, shortcut: '2' },
    { key: ROBOT.BLUE, shortcut: '3' },
    { key: ROBOT.YELLOW, shortcut: '4' },
]

/**
 * Sidebar panel showing all 4 robots with selection state, completion tracking, and keyboard hints
 */
export const RobotPanel = () => {
    const dispatch = useDispatch()
    const status = useSelector(state => state.boards.status)
    const selectedRobot = useSelector(state => state.boards.selectedRobot)
    const completedRobots = useSelector(getCompletedRobots)

    const isWin = status === Status.WIN

    return (
        <div style={{
            backgroundColor: 'var(--color-panel-bg)',
            border: '1px solid var(--color-panel-border)',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '0.75rem',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>Robots</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {completedRobots.length}/4 completed
                </span>
            </div>
            {ROBOT_KEYS.map(({ key, shortcut }) => {
                const IconComponent = ROBOT_ICON_MAP[key]
                const isCompleted = completedRobots.includes(key)
                const isSelected = selectedRobot === key

                let itemStyle = {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    border: '2px solid transparent',
                    transition: 'all 0.2s ease',
                }

                if (isCompleted) {
                    itemStyle.opacity = 0.5
                } else {
                    itemStyle.cursor = 'pointer'
                }

                if (isSelected && !isCompleted) {
                    itemStyle.border = `2px solid ${ROBOT_COLOR_MAP[key]}`
                }

                if (isCompleted && isWin) {
                    itemStyle.backgroundColor = 'var(--color-win-bg)'
                }

                const handleClick = () => {
                    if (!isCompleted && !isWin) {
                        dispatch(actions.selectRobot(key))
                    }
                }

                return (
                    <div key={key} style={itemStyle} onClick={handleClick}>
                        <IconComponent size={28} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                                {ROBOT_NAME_MAP[key]}
                            </div>
                            {!isCompleted && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                                    Press {shortcut}
                                </div>
                            )}
                        </div>
                        {!isCompleted && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: ROBOT_COLOR_MAP[key], textTransform: 'uppercase' }}>Target</span>
                        )}
                        {isCompleted && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-win-bg)', textTransform: 'uppercase' }}>Done</span>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default RobotPanel
