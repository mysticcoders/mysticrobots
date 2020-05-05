import React from 'react'

import { useLocation } from 'react-router'

import { Section } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'
import { GameContainer } from '../containers/GameContainer'

import queryString from 'query-string'

export const DashboardPage = () => {
  const { search } = useLocation()

  const query = queryString.parse(search.indexOf('?') === 0 ? search.substr(1) : search)

  return (
    <div>
      <HeaderContainer />
      <Section style={{paddingTop: '0'}}>
          <GameContainer goalIndex={query.goalIndex} goalColor={query.goalColor} r={query.r} g={query.g} b={query.b} y={query.y} />
      </Section> 
    </div>
  )
}
