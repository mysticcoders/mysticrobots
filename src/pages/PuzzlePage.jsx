import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { actions } from '../ducks/boards'

import { HeaderContainer } from '../containers/HeaderContainer'

import { GameContainer } from '../containers/GameContainer'

export const PuzzlePage = () => {
  const { search } = useLocation()

  const dispatch = useDispatch()

  const query = Object.fromEntries(new URLSearchParams(search))

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
              goalIndex={query.goalIndex}
              goalColor={query.goalColor}
              r={query.r}
              g={query.g}
              b={query.b}
              y={query.y}
              config={query.config}
          />
      </section>
    </div>
  )
}

export default PuzzlePage
