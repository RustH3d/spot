 const moviesModel= require('../models/movies')
const axios = require('axios');
require('dotenv').config();

const getAllMovies= async(req,res)=>{
    try {
        const movies= await  moviesModel.getAllMovies()
        res.json(movies)
    } catch (error) {
        console.error("Error al obtener las peliculas:", error);
     res.status(500).json({ message: "Error al obtener las peliculas" });
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




const createMovie = async (req, res) => {
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({ message: 'El título es obligatorio' });
  }

  try {
    // Verifica si ya está en la base local
    const existingMovie = await moviesModel.findByTitle(titulo);
    if (existingMovie) {
      return res.status(200).json(existingMovie);
    }

    // Si no existe, buscar en TMDB
    const tmdbRes = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: titulo,
      },
    });

    const movie = tmdbRes.data.results[0];
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada en TMDB' });
    }

    // Insertar en la DB local
    const newMovie = await moviesModel.createMovie({
      titulo: movie.title,
      descripcion: movie.overview,
      fecha_lanzamiento: movie.release_date,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      tmdb_id: movie.id,
      categorias: [], // luego podrías rellenar esto
    });

    res.status(201).json(newMovie);
  } catch (error) {
    console.error('Error al crear película desde TMDB:', error);
    res.status(500).json({ message: 'Error interno al crear película' });
  }
};



const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { titulo,descripcion,fecha_lanzamiento,poster_url,tmdb_id,categorias } = req.body;

  try {
    const updatedMovie = await moviesModel.updateMovie({ id, titulo,descripcion,fecha_lanzamiento,poster_url,tmdb_id,categorias });
    res.json(updatedMovie);
  } catch (error) {
    console.error("Error al actualizar peliucla:", error);
    res.status(500).json({ message: "Error al actualizar pelicula" });
  }
};



const deleteMovie= async(req,res)=>{
  const { id } = req.params;
   try {
  const deleted = await moviesModel.deleteMovie({ id });
  if (!deleted) {
    return res.status(404).json({ message: 'Película no encontrada' });
  }
  res.status(204).send();
} catch (error) {
  console.error("Error al eliminar película:", error);
  res.status(500).json({ message: "Error al eliminar película" });
}
}

const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await moviesModel.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ message: "Pelicula no encontrada" });
    }
    res.json(movie);
  } catch (error) {
    console.error("Error al obtener pelicula por id:", error);
    res.status(500).json({ message: "Error al obtener pelicula" });
  }
};

module.exports={
    createMovie,
    updateMovie,
    deleteMovie,
    getAllMovies,
    getMovieById, 
}