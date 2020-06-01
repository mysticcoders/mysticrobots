const express = require('express')
const router = express.Router()

router.get('/', require('./get_challenges'))
router.get('/:challengeId', require('./get_challenge_by_id'))
router.get('/:challengeId/puzzles', require('./get_puzzles_by_challenge_id'))

module.exports = router
