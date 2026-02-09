import React from 'react'

import { PuzzlePage } from './PuzzlePage'
import { AboutPage } from './AboutPage'

import {
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

const App = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/random" replace />} />
        <Route path="/puzzle/:shareKey" element={<PuzzlePage />} />
        <Route path="/puzzle" element={<PuzzlePage />} />
        <Route path="/random" element={<Navigate to="/puzzle?reset=true" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
)

export default App
