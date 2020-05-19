import React from 'react'

import { Section, Container, Content, Title } from "rbx";

import { FaRobot, FaStar } from 'react-icons/fa'

import { HeaderContainer } from '../containers/HeaderContainer'
import { FooterContainer } from '../containers/FooterContainer'

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

                <Title>How to play?</Title>
                <Content>
                    There are 4 robots:
                    
                    <ul>
                        <li>
                            <FaRobot size="2em" style={{ color: 'red'}} /> &mdash; Rollie
                        </li>
                        
                        <li>
                            <FaRobot size="2em" style={{ color: 'green'}} /> &mdash; Gumball
                        </li>

                        <li>
                            <FaRobot size="2em" style={{ color: 'blue'}} /> &mdash; Blubber
                        </li>

                        <li>
                            <FaRobot size="2em" style={{ color: 'yellow'}} /> &mdash; Yolo
                        </li>

                    </ul>
                    

                    <p>
                        One goal exists for each puzzle in a corner (so that there are always 2 ways).
                    </p>

                    <p>
                        <FaStar size="2em" style={{ color: 'red' }} />
                        <FaStar size="2em" style={{ color: 'green' }} />
                        <FaStar size="2em" style={{ color: 'blue' }} />
                        <FaStar size="2em" style={{ color: 'yellow' }} />
                    </p>
                    
                    <p>
                        Use the least number of moves to move the equivalent color robot into the goal
                    </p>                        

                </Content>

                <Title>How to move?</Title>
                <Content>
                    <p>
                        If all keyboard, you can use the numbers 1 through 4 to select each of the robots. 1 = Rollie, 2 = Gumball, 3 = Blubber and 4 = Yolo. Use the arrow keys 
                        to move them around
                    </p>
                    <p>
                        Mouse controls available by rolling over any of the robots to see their path, or selecting the robot to see the path. And you can select on that path when the robot 
                        is selected in order to move that robot.
                    </p>
                    <p>
                        4 directional buttons are also given to your right (on desktop) and below (on mobile) so you can control with just mouse that way.
                    </p>
                    <p>
                        Swipe will be added soon.
                    </p>
                </Content>
                <Title>Who built this?</Title>
                <Content>
                    This was built and coded by the team at <a href="https://mysticcoders.com">Mystic Coders, LLC</a>
                </Content>
                <Title>Contributions</Title>
                <Content>
                    Please <a href="https://github.com/mysticcoders/mysticrobots" target="_blank" rel="noopener noreferrer">check out the repo on GitHub</a>.
                </Content>                
            </Container>
            </Section>

            <FooterContainer />
      </div>

  )
}
