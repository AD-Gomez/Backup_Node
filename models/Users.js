// Importing modules to create Schema and model from mongoose
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  firstNames: {
    type: String,
    required: true
  },
  lastNames: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id

    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
    delete returnedObject.passwordHasHistory
  }
})

userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const errorResponse = new Error('Hay un campo que ya esta registrado en otro user')
    if (error.keyValue.email) {
      errorResponse.error = 'El correo ya se encuentra registrado.'
    }
    next(errorResponse)
  } else {
    next(error)
  }
})

const User = model('User', userSchema)

module.exports = User
