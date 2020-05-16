const WALL = {
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

const ROBOT = {
    RED: 'RED',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    YELLOW: 'YELLOW'
}

const GOAL = {
    RED: 'RED',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    YELLOW: 'YELLOW'
}

const Status = {
    PLAYING: 'PLAYING',
    WIN: 'WIN'
}

module.exports = {
    WALL,
    ROBOT,
    GOAL,
    Status
}