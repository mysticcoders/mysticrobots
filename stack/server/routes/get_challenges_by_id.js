const challenges = require('../services/challenges')

const get_challenges_by_id = async (req, res) => {
    const id = req.params.id

    if(!req.params.id) {
        res.status(404).send("No challenge found")
        return
    }
 
    const data = await challenges.get_challenge_by_id({ challengeId: req.params.id })

    res.send(data)
}

module.exports = get_challenges_by_id
