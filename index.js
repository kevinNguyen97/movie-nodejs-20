'use strict';
const express = require('express');
const { sequelize } = require('./src/models');
const { logger } = require('./src/middlewares/logger');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

const rootRouter = require('./src/routers');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./src/graphql/schema');
const graphqlResolvers = require('./src/graphql/resolvers');

const app = express();

const httpServer = createServer(app);

app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(logger);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

app.use('/api/v1', rootRouter);

//
const io = new Server(httpServer);

// listen on port 3000
const port = 3000;
httpServer.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

// test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const arrUser = [];

io.on('connection', (socket) => {
  arrUser.push(socket.id);
  console.log('new connection', socket.id);
  socket.broadcast.emit('refresh-user', arrUser, socket.id);

  // get and check token
  // socket.handshake.auth

  socket.on('send-message', (message, callback) => {
    if (!message || !message.trim()) {
      return callback('empty message');
    }
    // emit to all user
    // io.emit('receive-message', message);

    // emit to all user except sender
    socket.broadcast.emit('receive-message', message);

    // callback();
  });

  socket.on('disconnect', () => {
    console.log('disconnect ', socket.id);

    const index = arrUser.indexOf(socket.id);
    if (index > -1) {
      arrUser.splice(index, 1);
    }
    io.emit('refresh-user', arrUser);
  });
});

// [socket1, socket2, socket3]
