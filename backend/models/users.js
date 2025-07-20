const db= require('../db')
const bcrypt= require('bcrypt')

const getAllUsers= async ()=>{
    const result= await db.query("SELECT id, name AS username, email FROM users ORDER BY name ASC")
    return result.rows
}



const createUser = async ({ name, email, password,is_author }) => {
   const hashed = await bcrypt.hash(password, 10);
  const userResult = await db.query(`INSERT INTO users (name, email, password, is_author)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, is_author`,
    [name, email, hashed, is_author||false]
  );

  const user= userResult.rows[0]

  await db.query(
    `INSERT INTO playlists (name, user_id, is_favorites)
     VALUES ($1, $2, true)`,
    ['Favoritos', user.id]
  );
  return user
};







const getUserByEmail= async(email)=>{
    const result= await db.query(
        "SELECT * FROM users WHERE email = $1", [email]
    )
     return result.rows[0]
}

const deleteUser= async({id})=>{
    const result= await db.query(
        "DELETE FROM users WHERE id = $1", [id]
    )
    return result.rowCount > 0
}

const updateUser = async ({ id, name, email, password }) => {
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name AS username, email",
      [name, email, hashedPassword, id]
    );
    return result.rows[0];
  } else {
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name AS username, email",
      [username, email, id]
    );
    return result.rows[0];
  }
};


const getUserById = async (id) => {
  const result = await db.query("SELECT id, nombre AS username, email FROM users WHERE id = $1", [id]);
  return result.rows[0];
};


module.exports={
    getAllUsers,
    createUser,
    getUserByEmail,
    updateUser,
    deleteUser,
    getUserById, 

}