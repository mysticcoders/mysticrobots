const challenges = require('../../../common/services/challenges')

const get_challenge_by_id = async (req, res) => {
    const challengeId = req.params.challengeId

    if(!req.params.challengeId) {
        res.status(404).send("No challenge found")
        return
    }
 
    const data = await challenges.get_challenge_by_id({ challengeId: req.params.challengeId })

    if(!data) {
        res.status(404).send("No challenge found")
        return
    }

    res.send(data)
}

module.exports = get_challenge_by_id
