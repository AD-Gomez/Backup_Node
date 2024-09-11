const express = require('express')

// Routing
const usersRouter = express.Router()

// Schema
const User = require('../models/users')

usersRouter.post('/', async (req, res) => {
  try {
    const { firstNames, lastNames, phoneNumber, email } = req.body

    // Validar los datos aquí si es necesario
    const newUser = new User({
      firstNames,
      lastNames,
      phoneNumber,
      email
    })

    // Guardar el usuario en la base de datos
    await newUser.save()

    res.status(201).json({ message: 'User created successfully', user: newUser })
  } catch (error) {
    // Manejar errores (por ejemplo, email duplicado)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    res.status(500).json({ message: 'Error creating user', error })
  }
})

usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.find() // Obtén todos los usuarios
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error })
  }
})

usersRouter.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error })
  }
})

module.exports = usersRouter
