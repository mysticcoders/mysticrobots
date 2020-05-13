const {pool} = require('../database')

const moment = require('moment')

const get_challenges = async (req, res) => {
    let query = `SELECT id, start_time, end_time, created_at FROM challenge `

    console.log(moment().valueOf())
    
    if(req.query && req.query.latest === 'true') {
        query += ` ORDER BY created_at DESC LIMIT 1 `
    }
    const result = await pool.query(query, [])
    res.send(result.rows)
}

module.exports = get_challenges
