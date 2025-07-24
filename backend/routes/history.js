const express= require('express')
const router= express.Router()
const historyController= require('../controllers/history')

router.get('/:user_id',historyController.getUserHistory)
router.post('/', historyController.playSong)
router.get('/recommendations/:user_id',historyController.getRecommendations)

module.exports= router