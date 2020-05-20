'use strict';

const common = require('../lib/common');
const assert = require('assert')

describe('common', () => {
    it('exports the things we expect', () => {
        expect(common.board).toBeDefined()
        expect(common.utils).toBeDefined()
        expect(common.WALL).toBeDefined()
        expect(common.ROBOT).toBeDefined()
        expect(common.GOAL).toBeDefined()
        expect(common.Status).toBeDefined()
    });
});
