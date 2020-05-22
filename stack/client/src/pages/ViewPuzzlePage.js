import React from 'react'

import { useParams } from 'react-router'

import { Section } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'

import { GameContainer } from '../containers/GameContainer'

export const ViewPuzzlePage = () => {
  const { puzzleId } = useParams()

  return (
    <div>
      <HeaderContainer />
      <Section style={{padding: '0'}}>
        <GameContainer 
              puzzleId={puzzleId}
          />
      </Section> 
    </div>
  )
}

export default ViewPuzzlePage
