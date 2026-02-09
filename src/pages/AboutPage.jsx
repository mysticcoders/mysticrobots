import React from 'react'

import { FaStar } from 'react-icons/fa'

import { HeaderContainer } from '../containers/HeaderContainer'
import { FooterContainer } from '../containers/FooterContainer'
import { RollieIcon, GumballIcon, BlubberIcon, YoloIcon } from '../components/RobotIcons'

export const AboutPage = () => {
  return (
      <div>

          <HeaderContainer />

            <section className="section">
            <div className="container">
                <h2 className="title">About Mystic Robots</h2>

                <div className="content">
                    The online game is based on the board game Ricochet Robots.
                </div>

                <h2 className="title">How to play?</h2>
                <div className="content">
                    There are 4 robots:

                    <ul>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RollieIcon size={32} /> &mdash; Rollie
                        </li>

                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <GumballIcon size={32} /> &mdash; Gumball
                        </li>

                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BlubberIcon size={32} /> &mdash; Blubber
                        </li>

                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <YoloIcon size={32} /> &mdash; Yolo
                        </li>

                    </ul>


                    <p>
                        One goal exists for each puzzle in a corner (so that there are always 2 ways).
                    </p>

                    <p>
                        <FaStar size="2em" style={{ color: 'var(--color-robot-red)' }} />
                        <FaStar size="2em" style={{ color: 'var(--color-robot-green)' }} />
                        <FaStar size="2em" style={{ color: 'var(--color-robot-blue)' }} />
                        <FaStar size="2em" style={{ color: 'var(--color-robot-yellow)' }} />
                    </p>

                    <p>
                        Use the least number of moves to move the equivalent color robot into the goal
                    </p>

                </div>

                <h2 className="title">How to move?</h2>
                <div className="content">
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
                        Press <strong>H</strong> to get a hint from the solver showing the optimal next move.
                    </p>
                </div>
                <h2 className="title">Who built this?</h2>
                <div className="content">
                    This was built and coded by the team at <a href="https://mysticcoders.com" target="_blank" rel="noopener noreferrer">Mystic Coders, LLC</a>
                </div>

                <h2 className="title">Contributions</h2>
                <div className="content">
                    Please <a href="https://github.com/mysticcoders/mysticrobots" target="_blank" rel="noopener noreferrer">check out the repo on GitHub</a>.
                </div>
            </div>
            </section>

            <FooterContainer />
      </div>

  )
}
