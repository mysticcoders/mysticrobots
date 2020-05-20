import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { actions } from '../ducks/boards'

import { Section } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'

// import { GameContainer } from '../containers/GameContainer'

export const DailyChallengePage = () => {
  const dispatch = useDispatch()

  const challenge = useSelector(state => state.challenges.challenge)

  useEffect(() => {
    dispatch(actions.fetchLatestChallenge())
  }, [dispatch])

  useEffect(() => {
    console.dir(challenge)
      if(challenge) {
            dispatch(actions.fetchPuzzlesByChallenge({
                challengeId: challenge.challengeId
            }))
      }
  }, [dispatch, challenge])

  return (
    <div>
      <HeaderContainer />
      <Section style={{padding: '0'}}>
          {/* <GameContainer /> */}
      </Section> 
    </div>
  )
}

export default DailyChallengePage