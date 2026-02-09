import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { actions } from '../ducks/boards'

import { FaStar } from 'react-icons/fa'

import { WALL, ROBOT } from '../constants'
import { ROBOT_ICON_MAP, ROBOT_COLOR_MAP, ROBOT_HIGHLIGHT_MAP } from './RobotIcons'

/**
 * Renders a single cell on the game board including robots, goals, walls, and path highlights
 */
export const GamePiece = ({ gridCell, isInRobotPath = false, isHoveringInRobotPath = false }) => {

    const dispatch = useDispatch()

    const selectedRobot = useSelector(state => state.boards.selectedRobot)
    const hoverRobot = useSelector(state => state.boards.hoverRobot)

    const theSelectedRobot = useSelector(state => state.boards.robots[selectedRobot])
    const theHoverRobot = useSelector(state => hoverRobot && state.boards.robots[hoverRobot])

    if(!gridCell) {
        return null
    }

    const GoalWithRobot = () => {
        const IconComponent = ROBOT_ICON_MAP[gridCell.robot]
        return (
            <div style={{ backgroundColor: 'var(--color-goal-star)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                {IconComponent && <IconComponent size="75%" />}
            </div>
        )
    }

    const Robot = () => {
        const IconComponent = ROBOT_ICON_MAP[gridCell.robot]
        return IconComponent ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <IconComponent size="75%" />
            </div>
        ) : null
    }

    const Goal = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <FaStar style={{ width: '75%', height: '75%', color: 'var(--color-goal-star)' }} />
        </div>
    )

    let backgroundColor = 'var(--color-board-cell)'

    let wallTop = false, wallRight = false, wallBottom = false, wallLeft = false

    if(gridCell.walls) {
        if(gridCell.walls === WALL.NORTH_WEST) { wallTop = true; wallLeft = true }
        else if(gridCell.walls === WALL.NORTH_EAST) { wallTop = true; wallRight = true }
        else if(gridCell.walls === WALL.SOUTH_WEST) { wallBottom = true; wallLeft = true }
        else if(gridCell.walls === WALL.SOUTH_EAST) { wallBottom = true; wallRight = true }
        else if(gridCell.walls === WALL.NORTH) { wallTop = true }
        else if(gridCell.walls === WALL.EAST) { wallRight = true }
        else if(gridCell.walls === WALL.SOUTH) { wallBottom = true }
        else if(gridCell.walls === WALL.WEST) { wallLeft = true }
        else if(gridCell.walls === WALL.ALL) { wallTop = true; wallRight = true; wallBottom = true; wallLeft = true }
    }

    const wallBorder = `${wallTop ? 5 : 1}px ${wallRight ? 5 : 1}px ${wallBottom ? 5 : 1}px ${wallLeft ? 5 : 1}px`

    const gridLine = 'var(--color-board-grid-line)'
    const wallColor = 'var(--color-board-cell-wall)'
    const borderColorStyle = `${wallTop ? wallColor : gridLine} ${wallRight ? wallColor : gridLine} ${wallBottom ? wallColor : gridLine} ${wallLeft ? wallColor : gridLine}`

    const wallShadows = []
    if(wallTop) wallShadows.push('inset 0 2px 4px rgba(255,255,255,0.08)')
    if(wallBottom) wallShadows.push('inset 0 -2px 4px rgba(255,255,255,0.08)')
    if(wallLeft) wallShadows.push('inset 2px 0 4px rgba(255,255,255,0.08)')
    if(wallRight) wallShadows.push('inset -2px 0 4px rgba(255,255,255,0.08)')

    const handleClick = () => {
        if(gridCell.robot) {
            dispatch(actions.selectRobot(gridCell.robot))
        } else if(isInRobotPath) {
            if(gridCell.x < theSelectedRobot.x) {
                dispatch(actions.moveLeft())
            } else if(gridCell.x > theSelectedRobot.x) {
                dispatch(actions.moveRight())
            } else if(gridCell.y < theSelectedRobot.y) {
                dispatch(actions.moveUp())
            } else if(gridCell.y > theSelectedRobot.y) {
                dispatch(actions.moveDown())
            }
        }
    }

    const handleOnMouseEnter = () => {
        if(gridCell.robot) {
            dispatch(actions.updateHoverRobotPath(gridCell.robot))
        }
    }

    const pieceStyle = {
        width: `calc( 6.25 * var(--vmin-minus-padding) )`,
        height: `calc( 6.25 * var(--vmin-minus-padding) )`,
        display: 'block',
        borderWidth: wallBorder,
        borderStyle: "solid",
        borderColor: borderColorStyle,
        backgroundColor: backgroundColor,
        boxShadow: wallShadows.length > 0 ? wallShadows.join(', ') : 'none',
    }

    if(gridCell.robot && gridCell.robot === selectedRobot) {
        pieceStyle.backgroundColor = ROBOT_HIGHLIGHT_MAP[gridCell.robot] || backgroundColor
    }

    if(isInRobotPath) {
        pieceStyle.backgroundColor = ROBOT_HIGHLIGHT_MAP[selectedRobot] || backgroundColor
    }

    if(isHoveringInRobotPath) {
        pieceStyle.backgroundColor = ROBOT_HIGHLIGHT_MAP[hoverRobot] || backgroundColor
    }

    if(gridCell.robot) {
        pieceStyle.cursor = 'pointer'
    }

    return (
        <div onClick={() => { handleClick() }} onMouseEnter={()=> {handleOnMouseEnter() }} onMouseLeave={() => { dispatch(actions.clearHoverRobotPath() )}} style={pieceStyle}>
            <>
                { (gridCell.robot && gridCell.goal) &&
                    <GoalWithRobot />
                }
                { (gridCell.robot && !gridCell.goal) &&
                    <Robot />
                }
                { (gridCell.goal && !gridCell.robot) &&
                    <Goal />
                }
            </>

        </div>
    )
}


export default GamePiece
