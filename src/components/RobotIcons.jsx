import React from 'react'

/**
 * Rollie - Red robot: round dome head, rectangular body, two wheels, antenna nub, circular eyes
 */
export const RollieIcon = ({ size = 40, color = '#e63946' }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="2" x2="20" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="2" r="1.5" fill={color} />
        <ellipse cx="20" cy="11" rx="9" ry="7" fill={color} />
        <circle cx="16" cy="10" r="2" fill="#fff" />
        <circle cx="24" cy="10" r="2" fill="#fff" />
        <circle cx="16" cy="10" r="1" fill="#222" />
        <circle cx="24" cy="10" r="1" fill="#222" />
        <rect x="13" y="18" width="14" height="12" rx="2" fill={color} />
        <rect x="15" y="21" width="10" height="3" rx="1" fill="rgba(255,255,255,0.3)" />
        <circle cx="13" cy="34" r="4" fill={color} />
        <circle cx="27" cy="34" r="4" fill={color} />
        <circle cx="13" cy="34" r="2" fill="rgba(255,255,255,0.3)" />
        <circle cx="27" cy="34" r="2" fill="rgba(255,255,255,0.3)" />
    </svg>
)

/**
 * Gumball - Green robot: spherical body, single cyclops visor, stubby feet
 */
export const GumballIcon = ({ size = 40, color = '#2a9d4e' }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="18" r="14" fill={color} />
        <rect x="12" y="14" width="16" height="6" rx="3" fill="rgba(255,255,255,0.9)" />
        <circle cx="20" cy="17" r="3" fill="#222" />
        <circle cx="21" cy="16" r="1" fill="#fff" />
        <ellipse cx="20" cy="26" rx="4" ry="1.5" fill="rgba(255,255,255,0.2)" />
        <rect x="12" y="31" width="6" height="5" rx="3" fill={color} />
        <rect x="22" y="31" width="6" height="5" rx="3" fill={color} />
    </svg>
)

/**
 * Blubber - Blue robot: wide blocky body, flat-top head, thick arms, short legs, square eyes
 */
export const BlubberIcon = ({ size = 40, color = '#457be0' }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="4" width="20" height="8" rx="1" fill={color} />
        <rect x="14" y="6" width="4" height="4" rx="1" fill="#fff" />
        <rect x="22" y="6" width="4" height="4" rx="1" fill="#fff" />
        <rect x="15" y="7" width="2" height="2" fill="#222" />
        <rect x="23" y="7" width="2" height="2" fill="#222" />
        <rect x="8" y="12" width="24" height="16" rx="2" fill={color} />
        <rect x="12" y="15" width="16" height="4" rx="1" fill="rgba(255,255,255,0.2)" />
        <rect x="4" y="14" width="4" height="10" rx="2" fill={color} />
        <rect x="32" y="14" width="4" height="10" rx="2" fill={color} />
        <rect x="12" y="28" width="6" height="7" rx="2" fill={color} />
        <rect x="22" y="28" width="6" height="7" rx="2" fill={color} />
    </svg>
)

/**
 * Yolo - Yellow robot: angular body, zig-zag antenna, wide expressive eyes, angled legs
 */
export const YoloIcon = ({ size = 40, color = '#f0a500' }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <polyline points="18,10 16,4 20,7 18,1" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="20,10 8,18 12,30 28,30 32,18" fill={color} />
        <ellipse cx="16" cy="18" rx="4" ry="3" fill="#fff" />
        <ellipse cx="26" cy="18" rx="4" ry="3" fill="#fff" />
        <circle cx="16" cy="18" r="1.5" fill="#222" />
        <circle cx="26" cy="18" r="1.5" fill="#222" />
        <rect x="16" y="23" width="8" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        <line x1="14" y1="30" x2="10" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="26" y1="30" x2="30" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
)

export const ROBOT_ICON_MAP = {
    RED: RollieIcon,
    GREEN: GumballIcon,
    BLUE: BlubberIcon,
    YELLOW: YoloIcon,
}

export const ROBOT_COLOR_MAP = {
    RED: 'var(--color-robot-red)',
    GREEN: 'var(--color-robot-green)',
    BLUE: 'var(--color-robot-blue)',
    YELLOW: 'var(--color-robot-yellow)',
}

export const ROBOT_HIGHLIGHT_MAP = {
    RED: 'var(--color-highlight-red)',
    GREEN: 'var(--color-highlight-green)',
    BLUE: 'var(--color-highlight-blue)',
    YELLOW: 'var(--color-highlight-yellow)',
}

export const ROBOT_NAME_MAP = {
    RED: 'Rollie',
    GREEN: 'Gumball',
    BLUE: 'Blubber',
    YELLOW: 'Yolo',
}

export default ROBOT_ICON_MAP
