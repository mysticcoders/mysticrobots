'use strict';

const utils = require('../lib/utils');

describe('utils.rotateWall90', () => {
    it('can rotate wall N to E', () => {
        const rotatedWall = utils.rotateWall90('N')
        expect(rotatedWall).toBe('E')
    })

    it('can rotate wall E to S', () => {
        const rotatedWall = utils.rotateWall90('E')
        expect(rotatedWall).toBe('S')
    })

    it('can rotate wall S to W', () => {
        const rotatedWall = utils.rotateWall90('S')
        expect(rotatedWall).toBe('W')
    })

    it('can rotate wall W to N', () => {
        const rotatedWall = utils.rotateWall90('W')
        expect(rotatedWall).toBe('N')
    })

    it('can rotate wall NE to SE', () => {
        const rotatedWall = utils.rotateWall90('NE')
        expect(rotatedWall).toBe('SE')
    })

    it('can rotate wall NW to NE', () => {
        const rotatedWall = utils.rotateWall90('NW')
        expect(rotatedWall).toBe('NE')
    })

    it('can rotate wall SW to NW', () => {
        const rotatedWall = utils.rotateWall90('SW')
        expect(rotatedWall).toBe('NW')
    })

    it('can rotate wall SE to SW', () => {
        const rotatedWall = utils.rotateWall90('SE')
        expect(rotatedWall).toBe('SW')
    })

    it('ignore rotating wall if X', () => {
        const rotatedWall = utils.rotateWall90('X')
        expect(rotatedWall).toBe('X')
    })

    it('ignore rotating wall if not valid', () => {
        const rotatedWall = utils.rotateWall90('F')
        expect(rotatedWall).toBe('')
    })
})

describe('utils.randomIntFromInterval', () => {

    it('is random int within interval', () => {
        const randomValue = utils.randomIntFromInterval(0, 5)
        expect(randomValue).toBeGreaterThanOrEqual(0)
        expect(randomValue).toBeLessThanOrEqual(5)
    })
})

describe('utils.rotate', () => {

    it('given 4x4 array ensure it rotates correctly', () => {
        const randomGrid = [
            ['X', ''  , '', 'N'],
            ['' , ''  , '', '' ],
            ['W', ''  , '', '' ],
            ['' , ''  , '', '' ],
        ]

        const rotatedMatrix = utils.rotate(randomGrid)

        expect(rotatedMatrix[0][3]).toEqual('X')
        expect(rotatedMatrix[0][1]).toEqual('N')
    })

    it('given 4x4 array ensure it rotates correctly twice', () => {
        const randomGrid = [
            ['X', ''  , '', 'N'],
            ['' , ''  , '', '' ],
            ['W', ''  , '', '' ],
            ['' , ''  , '', '' ],
        ]

        const rotatedMatrix = utils.rotate(randomGrid, 2)

        expect(rotatedMatrix[3][3]).toEqual('X')
        expect(rotatedMatrix[1][3]).toEqual('E')
    })
})