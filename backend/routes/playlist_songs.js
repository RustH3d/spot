const express= require('express')
const router= express.Router()
const playlistSongController= require('../controllers/playlist_song')

router.post('/',playlistSongController.addSongToPlaylist)
router.get('/:playlist_id/songs', playlistSongController.getSongsFromPlaylist)
router.delete('/:playlist_id/:song_id',playlistSongController.removeSongsFromPlaylist)

module.exports=router