export const {
    REACT_APP_API_PROD_URL:API_PROD_URL,
    REACT_APP_API_STAGE_URL:API_STAGE_URL,
    REACT_APP_API_DEV_URL:API_DEV_URL,
    REACT_APP_API_LOCAL_URL:API_LOCAL_URL,
    REACT_APP_GOOGLE_ANALYTICS_KEY: GOOGLE_ANALYTICS_KEY,
} = process.env;

export const STAGE_ENV = 'staging';
export const PROD_ENV = 'prod';
export const LOCAL_ENV = 'local';

export const WALL = {
    NONE: null,
    NORTH_WEST: 'NORTH_WEST',
    SOUTH_WEST: 'SOUTH_WEST',
    NORTH_EAST: 'NORTH_EAST',
    SOUTH_EAST: 'SOUTH_EAST',
    NORTH: 'NORTH',
    EAST: 'EAST',
    SOUTH: 'SOUTH',
    WEST: 'WEST',
    ALL: 'ALL'
}

export const ROBOT = {
    RED: 'RED',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    YELLOW: 'YELLOW'
}

export const GOAL = {
    RED: 'RED',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    YELLOW: 'YELLOW'
}

export const Status = {
    PLAYING: 'PLAYING',
    WIN: 'WIN'
}

