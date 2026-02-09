import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'

import ReactGA from 'react-ga4'
import { FaSun, FaMoon } from 'react-icons/fa'

import { useTheme } from '../hooks/useTheme'
import { RollieIcon, GumballIcon, BlubberIcon, YoloIcon } from '../components/RobotIcons'

export const HeaderContainer = () => {

    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const [burgerActive, setBurgerActive] = useState(false)

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
                <a className="navbar-item" onClick={() => homepageOrPuzzle()} style={{ gap: '6px', alignItems: 'center' }}>
                    <RollieIcon size={20} />
                    <GumballIcon size={20} />
                    <BlubberIcon size={20} />
                    <YoloIcon size={20} />
                    <h1 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-navbar-brand)', marginLeft: '4px' }}>Mystic Robots</h1>
                </a>
                <a
                    role="button"
                    className={`navbar-burger ${burgerActive ? 'is-active' : ''}`}
                    aria-label="menu"
                    aria-expanded={burgerActive}
                    onClick={() => setBurgerActive(!burgerActive)}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div className={`navbar-menu ${burgerActive ? 'is-active' : ''}`}>
                <div className="navbar-start">
                    <a className="navbar-item" onClick={() => { navigate('/random'); setBurgerActive(false) }}>
                        Random Challenge
                    </a>
                    <a className="navbar-item" onClick={() => { navigate('/about'); setBurgerActive(false) }}>
                        About
                    </a>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <button
                            className="button"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-navbar-text)', fontSize: '1.2rem' }}
                        >
                            {theme === 'light' ? <FaMoon /> : <FaSun />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default HeaderContainer
