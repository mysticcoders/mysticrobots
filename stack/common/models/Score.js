const { Model } = require('objection')

class Score extends Model {
    static get tableName() {
        return 'score'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                challengeId: { type: 'string', format: 'uuid' },
                goalColor: { type: 'number' },
                goalIndex: { type: 'number' },
                redBot: { type: 'number' },
                greenBot: { type: 'number' },
                blueBot: { type: 'number' },
                yellowBot: { type: 'number' },
                config: { type: 'string' },
                createdAt: { type: 'string'},
            }
        }
    }

}

module.exports = Score