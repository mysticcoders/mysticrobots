import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions } from '../ducks/boards'

import { Column, List } from 'rbx'

import { GameBoard } from '../containers/GameBoard'
import { GameBoardController } from '../components/GameBoardController'

/**
 */
export const ChallengeContainer = ({challengeId}) => {
    const dispatch = useDispatch()

    const [selectedPuzzle, setSelectedPuzzle] = useState(undefined)

    const puzzles = useSelector(state => state.boards.puzzles)
    const metadata = useSelector(state => state.boards.metadata)

    useEffect(() => {
        if(challengeId) {
            dispatch(actions.clearBoard({}))
            dispatch(actions.fetchPuzzlesByChallenge({ challengeId: challengeId }))
        }
    }, [dispatch, challengeId])

    useEffect(() => {
        if(puzzles && Object.values(puzzles).length > 0 && !selectedPuzzle) {
            setSelectedPuzzle(puzzles[0].id)
        }
    }, [puzzles, selectedPuzzle])

    const changePuzzle = (puzzleId) => {
        dispatch(actions.clearBoard({}))

        const puzzle = Object.values(puzzles).filter(puzzle => puzzle.id === puzzleId)[0]

        setSelectedPuzzle(puzzle.id)

        dispatch(actions.updateMetadata({
            goalIndex: puzzle.goal_index,
            goalColor: puzzle.goal_color,
            r: puzzle.red_bot,
            g: puzzle.green_bot,
            b: puzzle.blue_bot,
            y: puzzle.yellow_bot,
            config: puzzle.config
        }))
    }

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

    if(!puzzles && !selectedPuzzle) {
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

                <List>
                    { Object.values(puzzles).map((puzzle, idx) => (
                        <List.Item key={idx} active={puzzle.id === selectedPuzzle} onClick={ () => { changePuzzle(puzzle.id)} }>{puzzle.id}</List.Item>
                    ))}
                </List>

                <GameBoardController />

            </Column>

        </Column.Group>
    )
}



export default ChallengeContainer