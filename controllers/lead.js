const express = require('express')
const leadRouter = express.Router()

// Utils
const sendMail = require('../utils/mailer')

// Constants
const EMAIL_TO = process.env.EMAIL_TO

leadRouter.post('/send-email/', async (request, response, next) => {
  try {
    const data = request.body
    const email = data.email

    if (!email) {
      return response.status(400).json({
        error: 'Es necesario el email.'
      })
    }

    // Generar el contenido del email
    let vehiclesText = ''
    let index = 1

    while (data[`vehicle_make_${index}`]) {
      vehiclesText += `
Vehicle(${index})

Vehicle_model_year_${index}: ${data[`vehicle_model_year_${index}`]}
Vehicle_make_${index}: ${data[`vehicle_make_${index}`]}
Vehicle_model_${index}: ${data[`vehicle_model_${index}`]}
Vehicle_inop_${index}: ${data[`vehicle_inop_${index}`]}
      `
      index++
    }

    const formattedText = `
Order_ID: ${data.number_lead}
Customer

First_name: ${data.first_name}
Phone: ${data.phone}
Email: ${data.email}

Route

Origin: ${data.origin}
Destination: ${data.destination}

${vehiclesText}

Transport_type: ${data.transport_type}
Ship_date: ${data.ship_date}
    `

    await sendMail(EMAIL_TO, 'Un cliente solicitó tu servicio', formattedText)
      .then(() => response.status(200).json({ message: 'Correo enviado.' }))
      .catch(error => {
        response.status(500).json({
          error: `Hubo un error: ${error.message}`
        })
      })
  } catch (error) {
    next(error)
  }
})

module.exports = leadRouter
