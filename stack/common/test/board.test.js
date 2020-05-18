'use strict';

const board = require('../lib/board')

describe('board', () => {
    it('has a classic board', () => {
        expect(board.classic).toBeDefined()
    })
})

describe('board.setupGoal', () => {
    it('', () => {

        // use same config so we get the same result and can test
        const grid = {}
        const config = board.setupBoard({ grid })

        console.dir(config)
        console.dir(grid)
    })

})
