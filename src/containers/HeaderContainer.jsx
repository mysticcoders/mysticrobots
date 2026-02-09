import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import ReactGA from 'react-ga4'

export const HeaderContainer = () => {

    const navigate = useNavigate()

    const metadata = useSelector(state => state.boards.metadata)

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search })
    }, [])

    const homepageOrPuzzle = () => {
        if(metadata) {
            navigate(`/puzzle?goalIndex=${metadata.goalIndex}&goalColor=${metadata.goalColor}&r=${metadata.r}&g=${metadata.g}&b=${metadata.b}&y=${metadata.y}`)
        } else {
            navigate(`/random`)
        }
    }

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" onClick={() => homepageOrPuzzle()}>
                    <h1>Mystic Robots</h1>
                </a>
                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div className="navbar-menu">
                <div className="navbar-start">
                    <a className="navbar-item" onClick={() => navigate('/random')}>
                        Random Challenge
                    </a>
                    <a className="navbar-item" onClick={() => navigate('/about')}>
                        About
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default HeaderContainer
