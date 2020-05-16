const board = require('./board')
const utils = require('./utils')
const constants = require('./constants')

module.exports = {
    board,
    utils,
    WALL: constants.WALL,
    ROBOT: constants.ROBOT,
    GOAL: constants.GOAL,
    Status: constants.Status,
}
