const db= require('../db')

const createPlaylist= async({name,user_id,is_favorites=false})=>{
    const result= await db.query(`
    INSERT INTO playlists (name, user_id, is_favorites)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [name, user_id, is_favorites])

    return result.rows[0]
}

const getAllPlaylists= async()=>{
    const result= await db.query(`
    SELECT p.*, u.name AS user_name
    FROM playlists p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC`)

    return result.rows
}

const getPlaylistById = async (id) => {
  const result = await db.query(`SELECT * FROM playlists WHERE id = $1`, [id]);
  return result.rows[0];
};

const updatePlaylist= async({id, name, is_favorites})=>{
 const result= await db.query(`
    UPDATE playlists
    SET name = $1, is_favorites = $2
    WHERE id = $3
    RETURNING *`,
    [name, is_favorites, id]
  )
  return result.rows[0];
}

const deletePlaylist=async(id)=>{
    const result= await db.query(`DELETE FROM playlists WHERE id = $1`, [id])
    return result.rowCount > 0;
}

const getUserPlaylists = async (user_id) => {
  const result = await db.query(
    `SELECT * FROM playlists WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};

const getFavoritesPlaylistId= async(user_id)=>{
  const result = await db.query(
    `SELECT id FROM playlists WHERE user_id = $1 AND is_favorites = true`,
    [user_id]
  );

  if (result.rows.length === 0) {
    const newPlaylist = await db.query(
      `INSERT INTO playlists (name, user_id, is_favorites)
       VALUES ('Favoritos', $1, true)
       RETURNING id`,
      [user_id]
    );
    return newPlaylist.rows[0].id;
  }
   return result.rows[0].id;
}


module.exports={
    createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  getUserPlaylists,
  getFavoritesPlaylistId
}


