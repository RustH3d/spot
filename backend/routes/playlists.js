const db= require('../db')



const express= require('express')
const router= express.Router()
const playlistController= require('../controllers/playlists')

router.get('/',playlistController.getAllPlaylists)
router.get('/:id',playlistController.getPlaylistById)
router.post('/',playlistController.createPlaylist)
router.put("/:id",playlistController.updatePlaylist)
router.delete('/:id',playlistController.deletePlaylist)
router.get('/user/:user_id', playlistController.getUserPlaylists);

module.exports= router