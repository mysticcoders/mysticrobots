import React, { useEffect } from 'react'

import { useParams } from 'react-router'

import { Section } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'

import { ChallengeContainer } from '../containers/ChallengeContainer'

export const ChallengePage = () => {
  const { challengeId } = useParams()

  return (
    <div>
      <HeaderContainer />
      <Section style={{padding: '0'}}>
          <ChallengeContainer 
            challengeId={challengeId} />

      </Section> 
    </div>
  )
}

export default ChallengePage