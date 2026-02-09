import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'

import { actions } from '../ducks/boards'
import { decodeShareKey } from '../utils/shareKey'

import { HeaderContainer } from '../containers/HeaderContainer'

import { GameContainer } from '../containers/GameContainer'

export const PuzzlePage = () => {
  const { search } = useLocation()
  const { shareKey } = useParams()

  const dispatch = useDispatch()

  const query = Object.fromEntries(new URLSearchParams(search))

  const puzzleParams = shareKey ? decodeShareKey(shareKey) : query

  useEffect(() => {
    if(query.reset) {
      dispatch(actions.clearBoard({}))
      dispatch(actions.setupBoard({}))
    }
  }, [dispatch, query.reset])

  return (
    <div>
      <HeaderContainer />
      <section className="section" style={{padding: '0'}}>
          <GameContainer
              goalIndex={puzzleParams.goalIndex}
              goalColor={puzzleParams.goalColor}
              r={puzzleParams.r}
              g={puzzleParams.g}
              b={puzzleParams.b}
              y={puzzleParams.y}
              config={puzzleParams.config}
          />
      </section>
    </div>
  )
}

export default PuzzlePage
