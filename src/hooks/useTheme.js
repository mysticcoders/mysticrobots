import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for managing dark/light theme with localStorage persistence and system preference detection
 */
export function useTheme() {
    const [theme, setThemeState] = useState(() => {
        const stored = localStorage.getItem('mysticrobots-theme')
        if (stored === 'dark' || stored === 'light') return stored
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
        return 'light'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('mysticrobots-theme', theme)
    }, [theme])

    const toggleTheme = useCallback(() => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light')
    }, [])

    return { theme, toggleTheme }
}

export default useTheme
