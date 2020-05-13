const {pool} = require('../database')

const get_puzzles_by_challenge_id = async (req, res) => {
    const challengeId = req.params.challengeId

    if(!req.params.challengeId) {
        res.status(404).send("No challenge ID found")
        return
    }
    
    let query = `SELECT id, challenge_id, goal_color, goal_index, 
                    red_bot, green_bot, blue_bot, yellow_bot, config, 
                    created_at FROM challenge_puzzle WHERE challenge_id = $1`

    const result = await pool.query(query, [challengeId])
    res.send(result.rows)
}

module.exports = get_puzzles_by_challenge_id
