const db= require('../db')

const createSong= async({title, artist, genre, duration, file_url, uploaded_by})=>{
    const result= await db.query(`
        INSERT INTO songs (title, artist, genre, duration, file_url, uploaded_by)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
        `,[title,artist,genre,duration,file_url,uploaded_by])
        return result.rows[0]
}

const getAllSongs= async()=>{
    const result = await db.query(`
        SELECT s.*, u.name AS uploaded_by_name 
        FROM songs s 
        LEFT JOIN users u ON s.uploaded_by = u.id
        ORDER BY s.created_at DESC
        `)

        return result.rows
}

const getSongById= async(id)=>{
    const result= await db.query(`SELECT * FROM songs WHERE id = $1`,[id])
    return result.rows[0]
}
const updateSong = async({ id, title, artist, genre, duration, file_url }) => {
  const result = await db.query(`
    UPDATE songs
    SET title = $1, artist = $2, genre = $3, duration = $4, file_url = $5
    WHERE id = $6
    RETURNING *
  `, [title, artist, genre, duration, file_url, id]);

  return result.rows[0];
}


const deleteSong= async(id)=>{
     const result = await db.query("DELETE FROM songs WHERE id = $1", [id]);
    return result.rowCount > 0;
}

const findByTitle = async (title) => {
  const result = await db.query(
    `SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1)`,
    [`%${title}%`]
  );
  return result.rows;
};

const findByArtist = async (artist) => {
  const result = await db.query(
  `SELECT * FROM songs WHERE LOWER(artist) LIKE LOWER($1)`,
    [`%${artist}%`]
  )
  return result.rows;
};

const searchSong=async(query)=>{
 const result = await db.query(
    `SELECT * FROM songs 
     WHERE LOWER(title) LIKE LOWER($1) 
        OR LOWER(artist) LIKE LOWER($1)`,
    [`%${query}%`]
  );
  return result.rows;
}

module.exports={
    
    updateSong,
    getAllSongs,
    getSongById,
    findByArtist,
    findByTitle,
    searchSong,
    deleteSong,
    createSong
}

