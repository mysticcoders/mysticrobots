import ReactGA from 'react-ga4'

const trackEvent = (name, params) => ReactGA.event(name, params)

export const trackPuzzleStart = ({ puzzleType, boardConfig, hasUnsolvable }) => {
    trackEvent('puzzle_start', {
        puzzle_type: puzzleType,
        board_config: boardConfig,
        has_unsolvable: hasUnsolvable,
    })
}

export const trackPuzzleComplete = ({ totalMoves, optimalMoves, efficiencyRatio, elapsedSeconds }) => {
    trackEvent('puzzle_complete', {
        total_moves: totalMoves,
        optimal_moves: optimalMoves,
        efficiency_ratio: efficiencyRatio,
        elapsed_seconds: elapsedSeconds,
    })
}

export const trackRobotComplete = ({ robot, totalMovesSoFar, robotsCompleted }) => {
    trackEvent('robot_complete', {
        robot,
        total_moves_so_far: totalMovesSoFar,
        robots_completed: robotsCompleted,
    })
}

export const trackHintUsed = ({ robot, hintNumber }) => {
    trackEvent('hint_used', {
        robot,
        hint_number: hintNumber,
    })
}

export const trackPuzzleReset = ({ movesBeforeReset, robotsCompleted }) => {
    trackEvent('puzzle_reset', {
        moves_before_reset: movesBeforeReset,
        robots_completed: robotsCompleted,
    })
}

export const trackUnsolvableDetected = ({ robots, when, puzzleType }) => {
    trackEvent('unsolvable_detected', {
        robots: robots.join(','),
        when,
        puzzle_type: puzzleType,
    })
}

export const trackThemeToggle = ({ newTheme }) => {
    trackEvent('theme_toggle', {
        new_theme: newTheme,
    })
}

export const trackNewPuzzle = () => {
    trackEvent('new_puzzle', {})
}
