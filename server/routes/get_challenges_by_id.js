const {pool} = require('../database')

const get_challenges_by_id = async (req, res) => {
    const id = req.params.id

    if(!req.params.id) {
        res.status(404).send("No challenge found")
        return
    }
 
    let query = `SELECT id, start_time, end_time, created_at FROM challenge WHERE 
                    id = $1`
    
    const result = await pool.query(query, [id])
    res.send(result.rows)
}

module.exports = get_challenges_by_id
