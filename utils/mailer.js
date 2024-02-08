const nodemailer = require('nodemailer')
require('dotenv').config()

const DEBUG = process.env.DEBUG
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

// async..await is not allowed in global scope, must use a wrapper
async function sendMail (email, subject, text) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: DEBUG ? 587 : 465,
    secure: !DEBUG, // true for 465, false for other ports
    auth: {
      type: 'login',
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  })

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: EMAIL_USER, // sender address
    to: email, // list of receivers
    subject, // Subject line
    text // plain text body
  })

  console.log('Message sent: %s', info.messageId)
}

module.exports = sendMail
