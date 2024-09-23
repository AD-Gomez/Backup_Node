const mongoose = require('mongoose')

// Definir el esquema de usuario
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // Para recuperación de contraseña
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Crear y exportar el modelo de usuario
const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin
