const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register= async(req,res)=>{
    const {username,email,password,rol}= req.body

    try {
        const existing= await User.getUserByEmail(email)
    } catch (error) {
        
    }
}

module.exports={
    register
}