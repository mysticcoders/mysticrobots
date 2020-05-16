const scores = require('../services/scores')

const get_scores_by_challenge_id = async (req, res) => {
    const challengeId = req.params.challengeId

    if(!req.params.challengeId) {
        res.status(404).send("No challenge ID found")
        return
    }

    const data = await scores.get_scores_by_challenge_id({ challengeId })
    res.send(data)
}

module.exports = get_scores_by_challenge_id
