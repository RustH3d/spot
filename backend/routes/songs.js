const express= require('express')
const router= express.Router()
const songsController= require('../controllers/songs')

router.get('/',songsController.getAllSongs)
router.get('/:title/:title',songsController.findByTitle)
router.get('/:artist/:artist',songsController.findByArtist)
router.get('/:id',songsController.getSongById)
router.post('/',songsController.createSong)
router.put('/:id',songsController.updateSong)
router.delete('/:id',songsController.deleteSong)

module.exports= router