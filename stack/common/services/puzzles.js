const ChallengePuzzle = require('../models/ChallengePuzzle')

const { GOAL } = require('../lib/common')

const getPuzzlesByChallengeId = async({ challengeId }) => {
    if(!challengeId) {
        throw new Error("Challenge ID required")
    }

    return await ChallengePuzzle.query().where('challengeId', challengeId)
}

const getPuzzleById = async({ puzzleId }) => {
    if(!puzzleId) {
        throw new Error("Puzzle ID required")
    }

    return await ChallengePuzzle.query().findById(puzzleId).first()
}

const savePuzzle = async({ 
    challengeId, 
    goalColor, 
    goalIndex, 
    redBot, 
    greenBot, 
    blueBot, 
    yellowBot,
    config}) => {

    const goals = Object.values(GOAL)

    // if(goalIndex < 0 || goalIndex > goals.length - 1) {
    //     console.error(`Goal index must be a value between 0 and ${goals.length - 1}`)
    //     return
    // }

    const goalColorIndex = goals.indexOf(goalColor)

    return await ChallengePuzzle.query().insert({
        challengeId: challengeId,
        goalColor: goalColor,
        goalIndex: goalIndex,
        redBot: redBot,
        greenBot: greenBot,
        blueBot: blueBot,
        yellowBot: yellowBot,
        config: config,
    })
}

module.exports = {
    getPuzzlesByChallengeId,
    getPuzzleById,
    savePuzzle,
}