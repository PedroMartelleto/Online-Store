'use strict'

const http = require('http')
const express = require('express')
const debug = require('debug')('server')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
var cors = require('cors');

const uploadDBRoute = require('./routes/uploadDB')

const app = express()

dotenv.config()

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to the database.")
}).catch(err => {
    console.log("Error: ", err.message)
})

app.use(cors({ origin: null }));

// ! NOTE: Internal use - app.use("/api/uploadDB", uploadDBRoute)

// API Endpoints
app.use("/api/order", require('./routes/order'))
app.use("/api/product", require('./routes/product'))
app.use("/api/user", require('./routes/user'))
app.use("/api/cart", require('./routes/cart'))
app.use("/api/auth", require('./routes/auth'))

app.listen(process.env.PORT, () => {
    console.log("Backend server is running.")
})