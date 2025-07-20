const playlistModel= require('../models/playlists')

const createPlaylist= async(req,res)=>{
    const{name, user_id, is_favorites}= req.body
    if(!name||!user_id){
         return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    try {
        const playlist= await playlistModel.createPlaylist({ name, user_id, is_favorites })
        return res.status(201).json(playlist)
    } catch (error) {
        console.error('Error creando playlist:', error);
    res.status(500).json({ message: 'Error interno' });
    }
}

const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await playlistsModel.getAllPlaylists();
    res.json(playlists);
  } catch (error) {
    console.error('Error obteniendo playlists:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};

const getPlaylistById= async (req,res)=>{
    try {
        const playlists = await playlistModel.getPlaylistById(req.params.id);
        if (!playlists) return res.status(404).json({ message: 'No encontrada' });
     res.json(playlists);
    } catch (error) {
         console.error('Error obteniendo playlist:', error);
    res.status(500).json({ message: 'Error interno' });
    }
}

const updatePlaylist= async(req,res)=>{
    const { id } = req.params;
  const { name, is_favorites } = req.body;
   try {
     const playlist= await playlistModel.updatePlaylist({id,name, is_favorites})
    if (!playlist) return res.status(404).json({ message: 'No encontrada' });
    res.json(playlist);
   } catch (error) {
      console.error('Error actualizando playlist:', error);
    res.status(500).json({ message: 'Error interno' });
  }
   
}

const deletePlaylist= async(req,res)=>{
     try {
    const success = await playlistModel.deletePlaylist(req.params.id);
    if (!success) return res.status(404).json({ message: 'No encontrada' });
    res.json({ message: 'Eliminada' });
  } catch (error) {
    console.error('Error eliminando playlist:', error);
    res.status(500).json({ message: 'Error interno' });
  }
}

const getUserPlaylists = async (req, res) => {
  const { user_id } = req.params;

  try {
    const playlists = await playlistModel.getUserPlaylists(user_id);

    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ message: 'No se encontraron playlists para este usuario.' });
    }

    res.json(playlists);
  } catch (error) {
    console.error('Error al obtener las playlists del usuario:', error);
    res.status(500).json({ message: 'Error del servidor al obtener las playlists.' });
  }
};


module.exports={
    createPlaylist,
    getAllPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    getUserPlaylists
}