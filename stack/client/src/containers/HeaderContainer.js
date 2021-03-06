import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom"
import { Navbar } from "rbx"

import ReactGA from 'react-ga'

export const HeaderContainer = () => {

    const history = useHistory()

    const metadata = useSelector(state => state.boards.metadata)

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search)  
    }, [])

    const homepageOrPuzzle = () => {
        if(metadata) {
            history.push(`/puzzle?goalIndex=${metadata.goalIndex}&goalColor=${metadata.goalColor}&r=${metadata.r}&g=${metadata.g}&b=${metadata.b}&y=${metadata.y}`)
        } else {
            history.push(`/random`)
        }
    }

    return (
        <Navbar>
            <Navbar.Brand>
                <Navbar.Item onClick={() => homepageOrPuzzle() }>
                    <h1>Mystic Robots</h1>
                </Navbar.Item>
                <Navbar.Burger />
            </Navbar.Brand>
            <Navbar.Menu>
                <Navbar.Segment align="start">
                <Navbar.Item onClick={() => history.push('/random')}>
                    Random Puzzle
                </Navbar.Item>
                <Navbar.Item onClick={() => history.push('/daily')}>
                    Daily Challenge
                </Navbar.Item>
                <Navbar.Item onClick={() => history.push('/challenges')}>
                    Challenges
                </Navbar.Item>
                <Navbar.Item onClick={() => history.push('/about')}>
                    About
                </Navbar.Item>
                </Navbar.Segment>
            </Navbar.Menu>
        </Navbar>
    )
}

export default HeaderContainer