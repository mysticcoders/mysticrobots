import React from 'react'

import { PuzzlePage } from './PuzzlePage'
import { DailyChallengePage } from './DailyChallengePage'
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

        <Route path="/puzzle/:shareKey">
            <PuzzlePage />
        </Route>

        <Route path="/puzzle">
            <PuzzlePage />
        </Route>

        <Route path="/daily">
            <DailyChallengePage />
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
