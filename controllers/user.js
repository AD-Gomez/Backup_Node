const express = require('express')
const multer = require('multer')
const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

// Routing
const usersRouter = express.Router()

// Schema
const User = require('../models/Users')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Carpeta donde se guardarán temporalmente los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname) // Agregar timestamp al nombre del archivo
  }
})

const upload = multer({ storage })

const processExcelFile = (filePath) => {
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]

  // Convertir la hoja de cálculo a un array de objetos
  const data = XLSX.utils.sheet_to_json(worksheet)

  console.log(data)
  // Guardar cada fila del Excel en MongoDB
  data.forEach(async (row) => {
    const newClient = new User({
      firstNames: row.firstNames, // Cambiar según el nombre de las columnas en el archivo Excel
      lastNames: row.lastNames,
      phoneNumber: row.phoneNumber,
      email: row.email
    })
    try {
      await newClient.save()
    } catch (error) {
      console.error('Error al guardar en la base de datos:', error)
    }
  })
}

usersRouter.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.file.filename)

  try {
    processExcelFile(filePath)
    fs.unlinkSync(filePath)
    res.status(200).json({ message: 'Archivo procesado exitosamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el archivo', error })
  }
})

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
