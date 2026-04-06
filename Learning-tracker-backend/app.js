require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const {tokenExtractor} = require('./middleware/auth')
const mongoose = require('mongoose')
const { info, errorInfo } = require('./utils/logger')
const topicsRouter = require('./controllers/topics')
const { errorHandler } = require('./middleware/errorHandler')
const cors = require('cors')

const mongodb_uri = process.env.NODE_ENV==='test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI
mongoose.connect(mongodb_uri, {family:4}).then(() => {
    info('successfully connected to mongodb')
}).catch((err) => {
    errorInfo('unable to connect to mongodb', err.message)
})

app.use(express.json())
app.use(cors({
  origin: 'https://learning-tracker-lac.vercel.app'
}))
app.use(morgan('dev'))

app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/topics', topicsRouter)

app.use(errorHandler)

module.exports = app