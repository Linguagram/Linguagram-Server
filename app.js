"use strict";

// if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
// }

const http = require('http');
const { init } = require('./util/ws');
const express = require('express')
const app = express()

const routes = require('./routes')
const {errorHandler} = require('./middlewares/errorHandler')
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(routes)

// error handler
app.use(errorHandler)

const server = http.createServer(app);
init(server);

module.exports = server;
