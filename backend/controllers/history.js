const historyModel= require('../models/history')



const playSong= async(req,res)=>{
    const {user_id,song_id}=req.body
     console.log('🎯 [BODY]', req.body)
    if(!user_id||!song_id){
         return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        const entry= await historyModel.addToHistory(user_id,song_id)
        res.status(200).json(entry);
    } catch (error) {
        console.error('Error al registrar reproducción:', error);
    res.status(500).json({ message: 'Error al registrar reproducción' });
    }
}

const getUserHistory= async(req,res)=>{
    const {user_id}= req.params
    if(!user_id){
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        const history= await historyModel.getUserHistory(user_id)
        res.status(200).json(history)
    } catch (error) {
        console.error('Error al obtener historial:', error);
    res.status(500).json({ message: 'Error al obtener historial' });
    }
}

const getRecommendations= async(req,res)=>{
    const {user_id}= req.params
    console.log('🎯 [BODY]', req.body)
    try {
        const songs= await historyModel.getRecommendations(user_id)
        res.status(200).json(songs)
    } catch (error) {
        console.error('Error al cargar recomendaciones:', error);
    res.status(500).json({ message: 'Error cargar recomendacio nes' });
    }
}

module.exports={
    playSong,
    getUserHistory,
    getRecommendations
}