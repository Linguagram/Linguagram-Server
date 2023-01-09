"use strict";

// if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
// }

const http = require('http');
const { init } = require('./util/ws');
const express = require('express')
const app = express()

const routes = require('./routes')
const { errorHandler } = require('./middlewares/errorHandler')
const cors = require('cors')
const { Server } = require("socket.io");
const socketHandler = require("./config/socketHandler");

const onConnection = (socket) => {
    socketHandler(io, socket);
};

const server = http.createServer(app);
init(server);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", onConnection);


app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)



// error handler
app.use(errorHandler)




module.exports = { server, io };
