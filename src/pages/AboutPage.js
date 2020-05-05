import React from 'react'

import { Section, Container, Content, Title } from "rbx";

import { HeaderContainer } from '../containers/HeaderContainer'

export const AboutPage = () => {
  return (
      <div>
 
          <HeaderContainer />

            <Section>
            <Container>
                <Title>About Mystic Robots</Title>

                <Content>

                    The online game is based on the board game Ricochet Robots.
                    
                </Content>
            </Container>
            </Section>
      </div>

  )
}
