import React from 'react'

import { PuzzlePage } from './PuzzlePage'
import { AboutPage } from './AboutPage'

import {
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

const App = () => (
    <Switch>
        <Redirect exact from="/" to="/random" />

        <Route path="/puzzle">
            <PuzzlePage />
        </Route>

        <Redirect from="/random" to="/puzzle?reset=true" />

        <Route path="/about">
            <AboutPage />
        </Route>
        <Route>
            <NotFoundPage />
        </Route>
    </Switch>
)

export default App
