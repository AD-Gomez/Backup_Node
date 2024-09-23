// Importing dependencies
require('dotenv').config()
const connectDB = require('./mongo.js')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Middleware
const errorHandler = require('./middlewere/errorHandler.js')

// Instance my server app
const app = express()

// Importing controllers
const leadRouter = require('./controllers/lead')
const userRouter = require('./controllers/user.js')
const authRouter = require('./controllers/auth.js')
const adminRouter = require('./controllers/admin.js')

// Implementing modules in our app server
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(express.json())

// Implementing Routing...

app.use('/api/lead/', leadRouter)
app.use('/api/user/', userRouter)
app.use('/api/auth/', authRouter)
app.use('/api/admin/', adminRouter)

// Implementing middleware
app.use(errorHandler)

// Conectar a MongoDB
connectDB()

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = { app, server }
