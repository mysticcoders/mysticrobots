import React from 'react'

import { Section } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'
import { GameContainer } from '../containers/GameContainer'

export const DashboardPage = () => {
  return (
    <div>
      <HeaderContainer />
      <Section style={{paddingTop: '0'}}>
          <GameContainer />
      </Section>
    </div>
  )
}
