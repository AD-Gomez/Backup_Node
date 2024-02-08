// Importing dependencies
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Middleware
const errorHandler = require('./middlewere/errorHandler.js')

// Instance my server app
const app = express()

// Importing controllers
const leadRouter = require('./controllers/lead')

// Implementing modules in our app server
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(express.json())

// Implementing Routing...

app.use('/api/lead/', leadRouter)

// Implementing middleware
app.use(errorHandler)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = { app, server }
