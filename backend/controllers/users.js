const usersModel= require('../models/users')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers= async(req,res)=>{
    try {
        const users= await usersModel.getAllUsers()
        res.json(users)
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
     res.status(500).json({ message: "Error al obtener usuarios" });
    }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });

  try {
    const user = await usersModel.getUserByEmail(email);
    console.log("User found:", user);
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.status(200).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en login" });
  }
};


const createUser = async (req, res) => {
  
const { name, email, password, is_author } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const existing = await usersModel.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const user = await usersModel.createUser({ name, email, password, is_author });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};


const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updatedUser = await usersModel.updateUser({ id, name, email, password });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};



const deleteUser= async(req,res)=>{
    const { id } = req.params;
  console.log("ID a eliminar:", id);

  try {
    await usersModel.deleteUser({id});
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }

}

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await usersModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario por email:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario por id:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

module.exports={
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserByEmail,
    loginUser,
    getUserById, 
}