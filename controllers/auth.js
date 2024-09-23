const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Routing
const authRouter = express.Router()

// Schema
const Admin = require('../models/Admin')

// Login de usuario
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Busca al usuario
  const user = await Admin.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'Usuario o contraseña incorrecta' })
  }

  // Verifica la contraseña
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(400).json({ message: 'Usuario o contraseña incorrecta' })
  }

  // Genera el token JWT
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
  res.header('auth-token', token).json({ token })
})

module.exports = authRouter
