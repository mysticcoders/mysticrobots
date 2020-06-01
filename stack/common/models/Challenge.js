const { Model } = require('objection')

class Challenge extends Model {
    static get tableName() {
        return 'challenge'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                startTime: { type: 'number' },
                endTime: { type: 'number' },
                createdAt: { type: 'string'},
            }
        }
    }

}

module.exports = Challenge