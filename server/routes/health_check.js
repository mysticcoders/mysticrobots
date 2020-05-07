const {pool} = require('../database')

const health_check = async (req, res) => {
    const status = pool ? 200 : 500
    res.status(status).send(pool ? "OK" : "FAIL")
}

module.exports = health_check
