const {pool} = require('../database')

const get_scores_by_challenge_id = async (req, res) => {
    const challengeId = req.params.challengeId

    if(!req.params.challengeId) {
        res.status(404).send("No challenge ID found")
        return
    }

    let query = `SELECT id, challenge_id, name, ip_address, 
                    move_count. created_at FROM score WHERE challenge_id = $1`

    const result = await pool.query(query, [challengeId])
    res.send(result.rows)
}

module.exports = get_scores_by_challenge_id
