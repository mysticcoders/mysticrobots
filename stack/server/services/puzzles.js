const { pool } = require('../database')

const get_puzzles_by_challenge_id = async({ challengeId }) => {
    if(!challengeId) {
        throw new Error("Challenge ID required")
    }

    let query = `SELECT id, challenge_id, goal_color, goal_index, 
                    red_bot, green_bot, blue_bot, yellow_bot, config, 
                    created_at FROM challenge_puzzle WHERE challenge_id = $1`

    const result = await pool.query(query, [challengeId])

    return result.rows
}

const save_puzzle = async({ 
    challengeId, 
    goalColor, 
    goalIndex, 
    redBot, 
    greenBot, 
    blueBot, 
    yellowBot,
    config}) => {

    let query = `INSERT INTO challenge_puzzle 
                (challenge_id, goal_color, goal_index, red_bot, green_bot, blue_bot, yellow_bot, config)
                VALUES ('$1', '$2', $3, $4, $5, $6, $7, '$8')`

    await pool.query(query, [challengeId, goalColor, goalIndex, redBot, greenBot, blueBot, yellowBot, config])

}

module.exports = {
    get_puzzles_by_challenge_id,
    save_puzzle,
}