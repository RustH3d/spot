const db= require('../db')
const bcrypt= require('bcrypt')

const getAllComments= async ()=>{
    const result= await db.query(`
    SELECT * FROM comments ORDER BY created_at DESC
  `)
    return result.rows
}



const createComment = async ({ user_id, movie_id, comentario, puntaje }) => {
  
  const result = await db.query(`
    INSERT INTO comments (user_id, movie_id, comentario, puntaje)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [user_id, movie_id, comentario, puntaje]);
  return result.rows[0];
};







const getCommentsByMovie= async(movie_id)=>{
    const result= await db.query(`
    SELECT * FROM comments WHERE movie_id = $1 ORDER BY created_at DESC
  `, [movie_id])
     return result.rows
}

const getAverageRating= async (movie_id)=>{
    const result= await db.query(`SELECT 
      AVG(CASE WHEN u.rol = 'critic' THEN c.puntaje ELSE NULL END) AS critic_rating,
      AVG(CASE WHEN u.rol != 'critic' THEN c.puntaje ELSE NULL END) AS user_rating
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.movie_id = $1`,
    [movie_id])
    return result.rows[0]
}

const deleteComment= async(id,user_id)=>{
    const result= await db.query(
        "DELETE FROM comments WHERE id = $1 AND user_id= $2", [id,user_id]
    )
    return result.rowCount > 0
}

const updateComment = async ({ id, user_id, comentario,puntaje }) => {
   
    const result = await db.query(`
    UPDATE comments
    SET comentario = $1,
        puntaje = $2,
        created_at = CURRENT_TIMESTAMP
    WHERE id = $3 AND user_id = $4
    RETURNING *
  `, [comentario, puntaje, id, user_id]
    );
    return result.rows[0];
  
};


const getCommentById = async (id) => {
  const result = await db.query('SELECT * FROM comments WHERE id = $1', [id]);
  return result.rows[0];
};


module.exports={
    
    createComment,
    getCommentsByMovie,
    updateComment,
    deleteComment,
    getAverageRating, 
    getCommentById,
    getAllComments

}