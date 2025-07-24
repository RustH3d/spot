const express= require('express')
const app= express()
const cors= require('cors')
require('dotenv').config();
const usersRoutes= require('./routes/users')
const historyRoutes=require('./routes/history')
const songsRoutes= require('./routes/songs')
const moviesRoutes= require('./routes/movies')
const commentsRoutes= require('./routes/comments')
const playlistRoutes=require('./routes/playlists')
const playlistSongsRoutes=require('./routes/playlist_songs')
const likeRoutes= require('./routes/like')
const PORT= process.env.PORT || 3000
const {Pool}= require('pg')
const pg = require('pg');

app.use(cors())
app.use(express.json())
app.use('/history',historyRoutes)
app.use('/users',usersRoutes)
app.use('/playlistSongs',playlistSongsRoutes)
app.use('/songs',songsRoutes)
app.use('/likes',likeRoutes)
app.use('/playlists',playlistRoutes)
app.use('/movies',moviesRoutes)
app.use('/comments',commentsRoutes)

app.get('/',(req,res)=>{
    res.send('Backend funcionando')
})



 const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "spotify",
  password: "L1nk3d",
  port: 5432,
}); 



 app.listen(PORT,()=>{
    console.log(`Corriendo en el puerto http://localhost:${PORT}`)
}) 