const models = require('./models')
const board = require('./lib/board')
const utils = require('./lib/utils')
const constants = require('./lib/constants')

module.exports = {
    board,
    utils,
    WALL: constants.WALL,
    ROBOT: constants.ROBOT,
    GOAL: constants.GOAL,
    Status: constants.Status,
    models,
}
