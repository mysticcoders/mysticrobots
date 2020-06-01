const Challenge = require('../models/Challenge')

const moment = require('moment')

const get_challenges = async ({ latest }) => {
    let query = `SELECT id, start_time, end_time, created_at FROM challenge `

    console.log(moment().valueOf())
    
    if(latest && latest === 'true') {
        query += ` ORDER BY created_at DESC LIMIT 1 `
    }
    const result = await pool.query(query)

    return result.rows
}

const get_challenge_by_id = async({ challengeId }) => {
    if(!challengeId) {
        throw new Error("Challenge ID required")
    }

    let query = `SELECT id, start_time, end_time, created_at FROM challenge WHERE 
                    id = $1`
    
    const result = await pool.query(query, [challengeId])

    return result.rows[0]
}

module.exports = {
    get_challenges,
    get_challenge_by_id,
}