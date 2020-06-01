const { pool } = require('../../server/database')
const { GOAL } = require('common')

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

const get_puzzle_by_id = async({ puzzleId }) => {
    if(!puzzleId) {
        throw new Error("Puzzle ID required")
    }

    let query = `SELECT id, challenge_id, goal_color, goal_index, 
                    red_bot, green_bot, blue_bot, yellow_bot, config, 
                    created_at FROM challenge_puzzle WHERE id = $1`

    const result = await pool.query(query, [puzzleId])

    return result.rows[0]
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

    const goals = Object.values(GOAL)

    if(goalIndex < 0 || goalIndex > goals.length - 1) {
        console.error(`Goal index must be a value between 0 and ${goals.length - 1}`)
        return
    }

    const goalColorIndex = goals.indexOf(goalColor)

    let query = `INSERT INTO challenge_puzzle 
                (challenge_id, goal_color, goal_index, red_bot, green_bot, blue_bot, yellow_bot, config)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

    await pool.query(query, [challengeId, goalColorIndex, goalIndex, redBot, greenBot, blueBot, yellowBot, config])

}

module.exports = {
    get_puzzles_by_challenge_id,
    get_puzzle_by_id,
    save_puzzle,
}