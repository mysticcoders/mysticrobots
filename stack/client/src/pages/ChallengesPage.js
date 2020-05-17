import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { actions } from '../ducks/boards'

import { Section } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'

// import { GameContainer } from '../containers/GameContainer'

export const ChallengesPage = () => {
  const dispatch = useDispatch()

  const challenges = useSelector(state => state.boards.challenges)

  useEffect(() => {
    dispatch(actions.fetchChallenges())
  }, [dispatch])

  useEffect(() => {
    console.dir(challenges)
      if(challenges) {
      }
  }, [dispatch, challenges])

  return (
    <div>
      <HeaderContainer />
      <Section style={{padding: '0'}}>
          {/* <GameContainer /> */}
      </Section> 
    </div>
  )
}

export default ChallengesPage