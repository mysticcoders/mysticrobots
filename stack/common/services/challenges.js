const Challenge = require('../models/Challenge')

const get_challenges = async ({ latest }) => {

    if(latest && latest === 'true') {
        return await Challenge.query().select('id', 'startTime', 'endTime', 'createdAt').first().orderBy('createdAt', 'desc')
    }
    return await Challenge.query().select('id', 'startTime', 'endTime', 'createdAt')
}

const get_challenge_by_id = async({ challengeId }) => {
    if(!challengeId) {
        throw new Error("Challenge ID required")
    }

    return await Challenge.query().findById(challengeId).first()
}

module.exports = {
    get_challenges,
    get_challenge_by_id,
}