const { Model } = require('objection')

class ChallengePuzzle extends Model {
    static get tableName() {
        return 'challengePuzzle'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                challengeId: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                ipAddress: { type: 'string' },
                moveCount: { type: 'number' },
                createdAt: { type: 'string' },
            }
        }
    }

}

module.exports = ChallengePuzzle