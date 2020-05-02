import React from 'react'

import { Link } from "react-router-dom"

import { Navbar } from "rbx"

// import store from 'store2'

export const HeaderContainer = () => {

    return (
        <Navbar>
            <Navbar.Brand>
                <Navbar.Item>
                    <Link to={`/`}>
                        <h1>Mystic Robots</h1>
                    </Link>
                </Navbar.Item>
                <Navbar.Burger />
            </Navbar.Brand>
            <Navbar.Menu>
                <Navbar.Segment align="start">
                <Navbar.Item>
                    <Link to={`/`}>
                        Daily Challenge
                    </Link>
                </Navbar.Item>
                <Navbar.Item>
                    <Link to={`/`}>
                        High Scores
                    </Link>
                </Navbar.Item>
                <Navbar.Item>
                    <Link to={`/about`}>
                        About
                    </Link>
                </Navbar.Item>
                </Navbar.Segment>
            </Navbar.Menu>
        </Navbar>
    )
}

export default HeaderContainer