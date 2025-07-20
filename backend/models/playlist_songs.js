const db= require('../db')

const addSongToPlaylist= async(playlist_id,song_id)=>{

     const exists = await db.query(
    `SELECT 1 FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2`,
    [playlist_id, song_id]
  );

  if (exists.rowCount > 0) {
    // Ya está agregada, devolvés algo opcional o null
    return null;
  }

    const result= await db.query( `INSERT INTO playlist_songs (playlist_id, song_id)
     VALUES ($1, $2)
     RETURNING *`,
    [playlist_id, song_id])

    return result.rows[0]
}

const getSongsFromPlaylist= async(playlist_id)=>{
    const result= await db.query(  `SELECT ps.*, s.title, s.artist, s.genre, s.duration, s.file_url
     FROM playlist_songs ps
     JOIN songs s ON ps.song_id = s.id
     WHERE ps.playlist_id = $1
     ORDER BY ps.added_at DESC`,
    
    [playlist_id])

    return  result.rows
}

const removeSongsFromPlaylist= async(playlist_id,song_id)=>{
    const result= await db.query(`DELETE FROM playlist_songs
     WHERE playlist_id = $1 AND song_id = $2`,
    [playlist_id, song_id])

    return result.rowCount > 0
}

//bruuuuhnjkjjkjkj
module.exports={
    addSongToPlaylist,
    removeSongsFromPlaylist,
    getSongsFromPlaylist
}