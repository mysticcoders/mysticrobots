const puzzles = require('common').services.puzzles

const get_puzzles_by_challenge_id = async (req, res) => {
    const challengeId = req.params.challengeId

    if(!req.params.challengeId) {
        res.status(404).send("No challenge ID found")
        return
    }
    
    const data = await puzzles.getPuzzlesByChallengeId({challengeId})
    res.send(data)
}

module.exports = get_puzzles_by_challenge_id
