const Score = require('../models/Score')

const getScoresByChallengeId = async ({ challengeId }) => {
    if(!challengeId) {
        throw new Error("Challenge ID required")
    }

    return Score.query().where('challengeId', challengeId)
}

/**
 * TODO write this implementation
 * 
 * @param {*} param0 
 */
const save_score = async({ challengeId }) => {
    if(!challengeId) {
        throw new Error("Challenge ID required")
    }

}

module.exports = {
    getScoresByChallengeId,
    save_score,
}