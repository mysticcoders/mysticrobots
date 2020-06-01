const Challenge = require('../models/Challenge')

const getChallenges = async ({ latest }) => {

    if(latest && latest === 'true') {
        return await Challenge.query().select('id', 'startTime', 'endTime', 'createdAt').first().orderBy('createdAt', 'desc')
    }
    return await Challenge.query().select('id', 'startTime', 'endTime', 'createdAt')
}

const getChallengeById = async({ challengeId }) => {
    if(!challengeId) {
        throw new Error("Challenge ID required")
    }

    return await Challenge.query().findById(challengeId).first()
}

module.exports = {
    getChallenges,
    getChallengeById,
}