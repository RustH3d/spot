const playlistSongsModel= require('../models/playlist_songs')

const addSongToPlaylist= async(req,res)=>{
     const { playlist_id, song_id } = req.body;
     console.log('playlist_id:', playlist_id, 'song_id:', song_id);

     if(!playlist_id||!song_id){
          return res.status(400).json({ message: 'Faltan campos obligatorios' });
     }

     try {
        const added= await playlistSongsModel.addSongToPlaylist(playlist_id,song_id)
        
        res.status(200).json(added)
     } catch (error) {
        console.error('Error al agregar canción a la playlist:', error);
    res.status(500).json({ message: 'Error interno al agregar canción a la playlist' });
     }
}

const getSongsFromPlaylist= async(req,res)=>{
    const { playlist_id } = req.params;
     console.log('🎯 [CONTROLLER] playlist_id:', playlist_id)
    try {
        const songs= await playlistSongsModel.getSongsFromPlaylist(playlist_id)
         console.log('📦 [CONTROLLER] songs:', songs)
        res.status(200).json(songs)
        
    } catch (error) {
        console.error('Error al obtener canciones de la playlist:', error);
    res.status(500).json({ message: 'Error interno al obtener canciones' });
    }
}

const removeSongsFromPlaylist= async(req,res)=>{
    const{playlist_id,song_id}= req.params
    try {
        const removed= await playlistSongsModel.removeSongsFromPlaylist(playlist_id,song_id)
        if(removed){
            res.json({ message: 'Canción eliminada de la playlist' });
        }else{
            res.status(404).json({ message: 'Canción o playlist no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar canción de la playlist:', error);
    res.status(500).json({ message: 'Error interno al eliminar canción' });
    }


}

module.exports={
    getSongsFromPlaylist,
    addSongToPlaylist,
    removeSongsFromPlaylist
}