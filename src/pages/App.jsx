import React from 'react'

import { DashboardPage } from './DashboardPage'
import { AboutPage } from './AboutPage'

import {
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

const App = () => (
    <Switch>
        <Redirect exact from="/" to="/dashboard" />

        <Route path="/dashboard">
            <DashboardPage />
        </Route>
        <Route path="/about">
            <AboutPage />
        </Route>
        <Route>
            <NotFoundPage />
        </Route>
    </Switch>
)

export default App
