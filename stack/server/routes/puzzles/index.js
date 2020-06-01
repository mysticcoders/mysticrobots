const express = require('express')
const router = express.Router()

router.get('/:puzzleId', require('./get_puzzle_by_id'))

module.exports = router
