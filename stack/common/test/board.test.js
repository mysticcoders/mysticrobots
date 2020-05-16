'use strict';

const board = require('../lib/board');
const assert = require('assert')

describe('board', () => {
    it('has a classic board', () => {
        assert.ok(board.classic)
    });
});
