import React from 'react'

import { ViewPuzzlePage } from './ViewPuzzlePage'
import { PuzzlePage } from './PuzzlePage'
import { DailyChallengePage } from './DailyChallengePage'
import { ChallengesPage } from './ChallengesPage'
import { ChallengePage } from './ChallengePage'
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

        <Route path="/puzzle/:puzzleId">
            <ViewPuzzlePage />
        </Route>

        <Route path="/puzzle">
            <PuzzlePage />
        </Route>

        <Route path="/daily">
            <DailyChallengePage />
        </Route>

        <Route path="/challenges">
            <ChallengesPage />
        </Route>

        <Route path="/challenge/:challengeId">
            <ChallengePage />
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
