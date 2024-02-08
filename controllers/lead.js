// Routing
const leadRouter = require('express').Router()

// Utils
const sendMail = require('../utils/mailer')

leadRouter.post('/send-email/', async (request, response, next) => {
  try {
    const data = request.body
    const email = data.email

    if (!email) {
      response.status(400).json({
        error: 'Es necesario el email.'
      })
    }

    let formattedText = ''
    for (const key in data) {
      if (Array.isArray(data[key])) {
        // Si el valor es un array, iteramos sobre cada elemento
        data[key].forEach((item, index) => {
          formattedText += `${key.charAt(0).toUpperCase() + key.slice(1)} ${index + 1}:\n`
          for (const itemKey in item) {
            formattedText += `  ${itemKey.charAt(0).toUpperCase() + itemKey.slice(1)}: ${item[itemKey]}\n`
          }
        })
      } else {
        // Imprimimos la clave y el valor directamente
        formattedText += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${data[key]}\n`
      }
    }

    await sendMail(email, 'Un cliente solicito tu servicio', formattedText).catch(error => {
      response.status(500).json({
        error: `Hubo un error: ${error.message}`
      })
    })
    response.status(200).json({
      message: 'Correo enviado.'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = leadRouter
