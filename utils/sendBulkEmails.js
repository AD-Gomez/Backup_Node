const sendMail = require('./mailer')

const sendBulkEmails = async (recipients, subject, text) => {
  for (const recipient of recipients) {
    await sendMail(recipient, subject, text)
  }
}

module.exports = sendBulkEmails
