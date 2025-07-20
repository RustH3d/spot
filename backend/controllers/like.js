const playlistModel = require('../models/playlists');
const playlistSongsModel = require('../models/playlist_songs');

const likeSong= async(req,res)=>{
    const {user_id,song_id}= req.body
    try {
        const playlist_id= await playlistModel.getFavoritesPlaylistId(user_id)
        if(!playlist_id) return res.status(404).json({ message: 'Playlist de favoritos no encontrada' })
        
            await playlistSongsModel.addSongToPlaylist(playlist_id, song_id);
    res.status(200).json({ message: 'Canción agregada a favoritos' });
    } catch (error) {
        console.error('Error al dar like:', error);
    res.status(500).json({ message: 'Error al dar like a la canción' });
        
    }
}

const unlikeSong= async(req,res)=>{
    const {user_id,song_id,playlist_id}= req.body 
    try {
        const playlist_id= await playlistModel.getFavoritesPlaylistId(user_id)
        if(!playlist_id) return res.status(404).json({ message: 'Playlist de favoritos no encontrada' })

        await playlistSongsModel.removeSongsFromPlaylist(playlist_id, song_id);
    res.status(200).json({ message: 'Canción quitada de favoritos' });
    } catch (error) {
        console.error('Error eliminar cancion:', error);
    res.status(500).json({ message: 'Error al eliminar a la canción' });
    }
}

const getLikedSongs= async(req,res)=>{
     const { user_id } = req.query;
  try {
    const playlist_id = await playlistModel.getFavoritesPlaylistId(user_id);
    if (!playlist_id)
      return res.status(404).json({ message: 'Playlist de favoritos no encontrada' });

    const songs = await playlistSongsModel.getSongsFromPlaylist(playlist_id);
    res.status(200).json(songs);
  } catch (error) {
    console.error('Error al obtener likes:', error);
    res.status(500).json({ message: 'Error al obtener canciones favoritas' });
  }
}

module.exports={
    likeSong,
    unlikeSong,
    getLikedSongs
}

