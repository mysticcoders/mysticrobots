const { Pool, Client } = require('pg')

const pool = new Pool()
// const client = new Client()

module.exports = { pool }
