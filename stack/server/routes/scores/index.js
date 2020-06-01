const express = require('express')
const router = express.Router()

router.get('/:challengeId', require('./get_scores_by_challenge_id'))
router.post('/:challengeId', require('./save_score_by_challenge_id'))

module.exports = router
