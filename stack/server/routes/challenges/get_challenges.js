const challenges = require('common').services.challenges

const get_challenges = async (req, res) => {
    const data = await challenges.get_challenges({ latest: req.query.latest })

    res.send(data)
}

module.exports = get_challenges
