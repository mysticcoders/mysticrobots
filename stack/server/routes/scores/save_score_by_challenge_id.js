const scores = require('common').services.scores

const save_score_by_challenge_id = async (req, res) => {
    console.log(req.body)
    res.send("OK")
}

module.exports = save_score_by_challenge_id
