import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Link } from 'react-router-dom'

import { actions } from '../ducks/boards'

import { Section, Title, Table, Container } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'

import moment from 'moment'

export const ChallengesPage = () => {
  const dispatch = useDispatch()

  const challenges = useSelector(state => state.boards.challenges)

  useEffect(() => {
      dispatch(actions.fetchChallenges())
  }, [dispatch])


  if(!challenges) {
      return (
        <h1>Loading...</h1>
      )
  }

  console.dir(challenges)

  return (
    <div>
      <HeaderContainer />
      <Section style={{padding: '0'}}>

      <Container>
          <Title>Challenges</Title>

          <Table fullwidth>
            <Table.Head>
              <Table.Row>
                <Table.Heading>ID</Table.Heading>
                <Table.Heading>Start</Table.Heading>
                <Table.Heading>End</Table.Heading>
                <Table.Heading>Created</Table.Heading>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {Object.values(challenges).map((challenge, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell><Link to={`/challenge/${challenge.id}`}>{challenge.id}</Link></Table.Cell>
                  <Table.Cell>{moment(Number(challenge.start_time)).format('YYYY-MM-DD HH:mm:ss')}</Table.Cell>
                  <Table.Cell>{moment(Number(challenge.end_time)).format('YYYY-MM-DD HH:mm:ss')}</Table.Cell>
                  <Table.Cell>{moment(challenge.created_at).fromNow()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
      </Container>
      </Section> 
    </div>
  )
}

export default ChallengesPage