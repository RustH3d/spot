const songsModel= require('../models/songs')
const axios = require('axios');
require('dotenv').config();

const getAllSongs= async(req,res)=>{
    try {
        const songs= await  songsModel.getAllSongs()
        res.json(songs)
    } catch (error) {
        console.error("Error al obtener las canciones:", error);
     res.status(500).json({ message: "Error al obtener las canciones" });
    }
}


/* const createMovie = async (req, res) => {
  
  const { titulo,descripcion,fecha_lanzamiento,poster_url,tmdb_id,categorias} = req.body;
  if (!titulo || !tmdb_id) {
    return res.status(400).json({ message: 'TITULO Y ID  de la API son obligatorios' });
  }

  try {
    const movie= await moviesModel.createMovie({titulo,descripcion,fecha_lanzamiento,poster_url,tmdb_id,categorias});
    res.status(201).json(movie)
  } catch (error) {
    console.error('Error al crear pelicula:', error);
    res.status(500).json({ message: 'Error al crear pelicula' });
  }
}; */




const createSong = async (req, res) => {
  const { title, artist, genre, duration, file_url, uploaded_by } = req.body;

  if (!title || !artist || !file_url) {
    return res.status(400).json({ message: 'fALTAN CAMPOS OBLIGATORIOS' });
  }

  try {
    const newSong= await songsModel.createSong({title, artist, genre, duration, file_url, uploaded_by})
    res.status(201).json(newSong)
  } catch (error) {
    console.error('Error al crear canción:', error);
    res.status(500).json({ message: 'Error al crear canción' });
  }
};



const updateSong = async (req, res) => {
  const { id } = req.params;
  const { title, artist, genre, duration, file_url } = req.body;

  try {
    const updatedSong = await songsModel.updatedSong({ id, title, artist, genre, duration, file_url });
    res.json(updatedSong);
  } catch (error) {
    console.error("Error al actualizar cancion", error);
    res.status(500).json({ message: "Error al actualizar cancion" });
  }
};



const deleteSong= async(req,res)=>{
  const { id } = req.params;
   try {
  const deleted = await songsModel.updateSong({ id });
  if (!deleted) {
    return res.status(404).json({ message: 'Caancion no encontrada' });
  }
  res.status(204).send();
} catch (error) {
  console.error("Error al eliminar Cancion:", error);
  res.status(500).json({ message: "Error al eliminar cancion" });
}
}

const getSongById = async (req, res) => {
  const { id } = req.params;
  try {
    const song = await songsModel.getSongById(id);
    if (!song) {
      return res.status(404).json({ message: "cncionno encontrada" });
    }
    res.json(movie);
  } catch (error) {
    console.error("Error al obtener cancion por id:", error);
    res.status(500).json({ message: "Error al obtener cancion" });
  }
};

const searchSongs=async(req,res)=>{
    const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Falta el parámetro de búsqueda' });

  try {
    const song= await songsModel.searchSongs(q)
     res.json(results);
  } catch (error) {
      console.error('Error al buscar canciones:', error);
    res.status(500).json({ message: 'Error al buscar canciones' });
  }
}

const findByArtist= async(req,res)=>{
    const {artist}= req.params

    try {
        const song= await songsModel.findByArtist(artist)
        res.json(song)
    } catch (error) {
        console.error('Error al buscar canciones:', error);
    res.status(500).json({ message: 'Error al buscar canciones' });
    }
}

const findByTitle= async(req,res)=>{
const {title}= req.params

    try {
        const song= await songsModel.findByTitle(title)
        res.json(song)
    } catch (error) {
        console.error('Error al buscar canciones:', error);
    res.status(500).json({ message: 'Error al buscar canciones' });
    }
}

module.exports={
    
    updateSong,
    deleteSong,
    getAllSongs,
    getSongById, 
    searchSongs,
    findByArtist,
    findByTitle,
    createSong
}