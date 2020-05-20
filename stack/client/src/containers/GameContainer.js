import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Column } from 'rbx'
import queryString from 'query-string'

import { GameBoard } from '../containers/GameBoard'
import { actions } from '../ducks/boards'
import { GameBoardController } from '../components/GameBoardController'

/**
 * Will contain the Retro Rockets gameboard
 */
export const GameContainer = ({puzzleId, goalIndex, goalColor, r, g, b, y, config}) => {
    const dispatch = useDispatch()

    const history = useHistory()

    const metadata = useSelector(state => state.boards.metadata)

    useEffect(() => {
        if(puzzleId) {
            dispatch(actions.clearBoard({}))
            dispatch(actions.fetchPuzzle({ id: puzzleId }))    
        }
    }, [dispatch, puzzleId])

    useEffect(() => {
        if(!puzzleId) {

            console.dir(metadata)

            const values = {
                goalIndex: metadata.goalIndex,
                goalColor: metadata.goalColor,
                r: metadata.r,
                g: metadata.g,
                b: metadata.b,
                y: metadata.y,
                config: metadata.config,
            }

            const stringified = queryString.stringify(values)

            history.replace(`/puzzle?${stringified}`)
        }
    }, [metadata, history, puzzleId])

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

    if(!metadata || Object.values(metadata).length === 0) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <Column.Group style={{margin: 0}}>

            <Column style={{padding: 0, margin: 0}}>
                <GameBoard goalIndex={metadata.goalIndex} goalColor={metadata.goalColor} r={metadata.r} g={metadata.g} b={metadata.b} y={metadata.y} config={metadata.config} />
            </Column>
            <Column>

                <GameBoardController />

            </Column>
        </Column.Group>
    )
}



export default GameContainer