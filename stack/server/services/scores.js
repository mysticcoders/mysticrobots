const { pool } = require('../database')

const get_scores_by_challenge_id = async ({ challengeId }) => {
    if(!challengeId) {
        throw new Error("Challenge ID required")
    }

    let query = `SELECT id, challenge_id, name, ip_address, 
                    move_count. created_at FROM score WHERE challenge_id = $1`

    const result = await pool.query(query, [challengeId])

    return result.rows
}

/**
 * TODO write this implementation
 * 
 * @param {*} param0 
 */
const save_score = async({ challengeId, score }) => {
    if(!challengeId) {
        throw new Error("Challenge ID required")
    }

    if(!score) {
        throw new Error("score required")
    }

}

module.exports = {
    get_scores_by_challenge_id,
    save_score,
}
