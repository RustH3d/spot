const  db= require('../db')

const addToHistory= async(user_id,song_id)=>{

    const result= await db.query(
   `INSERT INTO history (user_id, song_id)
     VALUES ($1, $2)
     RETURNING *`,
    [user_id, song_id])

    return result.rows
}

const getUserHistory= async(user_id)=>{
    const result= await db.query(
`SELECT h.song_id, s.title, s.artist, s.genre, s.duration, s.file_url, h.played_at
     FROM history h
     JOIN songs s ON h.song_id = s.id
     WHERE h.user_id = $1
     ORDER BY h.played_at DESC`,
    [user_id])

    return result.rows[0]
}

const getRecommendations= async(user_id)=>{
    const genreResult = await db.query(`
    SELECT s.genre, COUNT(*) AS count
    FROM history h
    JOIN songs s ON h.song_id = s.id
    WHERE h.user_id = $1
    GROUP BY s.genre
    ORDER BY count DESC
    LIMIT 1
  `, [user_id]);

  if (genreResult.rows.length === 0) return [];

  const favoriteGenre = genreResult.rows[0].genre;

  // 2. Buscar canciones de ese género que el usuario no haya escuchado
  const recResult = await db.query(`
    SELECT *
    FROM songs
    WHERE genre = $1
    AND id NOT IN (
      SELECT song_id FROM history WHERE user_id = $2
    )
    LIMIT 10
  `, [favoriteGenre, user_id]);

  return recResult.rows
}
module.exports={
    addToHistory,
    getRecommendations,
    getUserHistory

}
