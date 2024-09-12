const sendMail = require('./mailer')

// funcion apra el envio de emails masivos
const sendBulkEmails = async (recipients, subject, text) => {
  for (const recipient of recipients) {
    await sendMail(recipient, subject, text)
  }
}

module.exports = sendBulkEmails
