const errorHandler = (error, request, response, next) => {
  // Error handling middleware functionality
  const status = error.status || 500
  // send back an easily understandable error message to the caller
  response.status(status).json({ error: error.message })
}

module.exports = errorHandler
