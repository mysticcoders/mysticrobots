import React from 'react'

import { useHistory } from "react-router-dom"

import { Navbar } from "rbx"

// import store from 'store2'

export const HeaderContainer = () => {

    const history = useHistory()

    return (
        <Navbar>
            <Navbar.Brand>
                <Navbar.Item onClick={() => history.push('/')}>
                    <h1>Mystic Robots</h1>
                </Navbar.Item>
                <Navbar.Burger />
            </Navbar.Brand>
            <Navbar.Menu>
                <Navbar.Segment align="start">
                <Navbar.Item onClick={() => history.push('/')}>
                    Daily Challenge
                </Navbar.Item>
                <Navbar.Item onClick={() => history.push('/')}>
                        High Scores
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