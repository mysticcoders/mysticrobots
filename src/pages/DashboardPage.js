import React from 'react'

import { Section } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'
import { GameBoard } from '../containers/GameBoard'

export const DashboardPage = () => {
  return (
      <div>
 
          <HeaderContainer />

            <Section style={{paddingTop: '0'}}>
                <GameBoard />
            </Section>
      </div>

  )
}
