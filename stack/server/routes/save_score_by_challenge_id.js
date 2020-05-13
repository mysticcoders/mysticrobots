const {pool} = require('../database')

const save_score_by_challenge_id = async (req, res) => {
    console.log(req.body)
    res.send(pool ? "OK" : "FAIL")
}

module.exports = save_score_by_challenge_id
