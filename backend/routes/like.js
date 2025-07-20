const express= require('express')
const router= express.Router()
const likeController= require('../controllers/like')

router.post('/',likeController.likeSong)
router.get('/:user_id',likeController.getLikedSongs)
router.delete('/',likeController.unlikeSong)

module.exports=router