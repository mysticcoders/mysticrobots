const models = require('./models')
const board = require('./common/board')
const utils = require('./common/utils')
const constants = require('./common/constants')

module.exports = {
    board,
    utils,
    WALL: constants.WALL,
    ROBOT: constants.ROBOT,
    GOAL: constants.GOAL,
    Status: constants.Status,
    models,
}
