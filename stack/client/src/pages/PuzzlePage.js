import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'

import { actions } from '../ducks/boards'

import { Section } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'

import { GameContainer } from '../containers/GameContainer'

import queryString from 'query-string'

export const PuzzlePage = () => {
  const { search } = useLocation()

  const dispatch = useDispatch()

  const query = queryString.parse(search.indexOf('?') === 0 ? search.substr(1) : search)

  useEffect(() => {
    if(query.reset) {
      dispatch(actions.clearBoard({}))
      dispatch(actions.setupBoard({}))
    }
  }, [dispatch, query.reset])

  return (
    <div>
      <HeaderContainer />
      <Section style={{padding: '0'}}>
          <GameContainer 
              goalIndex={query.goalIndex} 
              goalColor={query.goalColor} 
              r={query.r} 
              g={query.g} 
              b={query.b} 
              y={query.y} 
              config={query.config}
          />
      </Section> 
    </div>
  )
}

export default PuzzlePage