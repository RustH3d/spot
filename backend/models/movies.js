const db= require('../db')

const createMovie= async ({titulo,descripcion,fecha_lanzamiento,poster_url,tmdb_id,categorias})=>{
    const result = await db.query(`INSERT INTO movies (titulo, descripcion, fecha_lanzamiento, poster_url, tmdb_id, categorias)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [titulo, descripcion, fecha_lanzamiento, poster_url, tmdb_id, categorias]);

  return result.rows[0];
    
}

const getAllMovies= async()=>{
    const result = await db.query(`SELECT * FROM movies  `);
  return result.rows[0];
}

const findByTitle = async (titulo) => {
  const result = await db.query(`SELECT * FROM movies WHERE LOWER(titulo) = LOWER($1)`, [titulo]);
  return result.rows[0];
};

const getMovieById= async(id)=>{
    const result= await db.query(`SELECT * FROM movies WHERE id = $1`, [id])
    return result.rows[0]
}

const updateMovie= async({id,titulo,descripcion,fecha_lanzamiento,poster_url,tmdb_id,categorias})=>{
     const result = await db.query(`
    UPDATE movies SET
      titulo = $1,
      descripcion = $2,
      fecha_lanzamiento = $3,
      poster_url = $4,
      categorias = $5
    WHERE id = $6
    RETURNING *
  `, [titulo, descripcion, fecha_lanzamiento, poster_url, categorias, id])
  return result.rows[0]
}

const deleteMovie= async ({id})=>{
   const result = await db.query('DELETE FROM movies WHERE id = $1', [id]);
  return result.rowCount > 0;  
}

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  findByTitle,
  updateMovie,
  deleteMovie
};