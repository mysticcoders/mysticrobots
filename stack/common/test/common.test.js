'use strict';

const assert = require('assert')
const { board, utils, WALL, ROBOT, GOAL, Status } = require('../lib/common')

describe('common', () => {
    it('exports', () => {
        assert.ok(board)
        assert.ok(utils)
        assert.ok(WALL)
        assert.ok(ROBOT)
        assert.ok(GOAL)
        assert.ok(Status)
    });
});
