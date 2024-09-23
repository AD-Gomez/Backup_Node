const express = require('express')
const bcrypt = require('bcrypt')

// Routing
const adminRouter = express.Router()

// Schema
const Admin = require('../models/Admin')

// Registro de usuario
adminRouter.post('/register', async (req, res) => {
  const { email, password } = req.body

  // Verifica si el usuario ya existe
  const userExist = await Admin.findOne({ email })
  if (userExist) {
    return res.status(400).json({ message: 'El usuario ya existe' })
  }

  // Encriptar contraseña
  const saltRound = 10
  const hashedPassword = await bcrypt.hash(password, saltRound)

  const newUser = new Admin({
    email,
    password: hashedPassword
  })

  try {
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario' })
  }
})

module.exports = adminRouter
