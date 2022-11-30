'use strict';
const express = require('express');
const { sequelize } = require('./src/models');
const { logger } = require('./src/middlewares/logger');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const moment = require('moment');

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

let arrUser = [];

const historyMessage = {};

io.on('connection', (socket) => {
  // arrUser.push(socket.id);
  console.log('new connection', socket.id);
  // socket.broadcast.emit('refresh-user', arrUser, socket.id);

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

  // handle user join room
  socket.on('join-room', ({ room, username }) => {
    socket.join(room); // join user to room

    // const _history = historyMessage[room];

    // if(_history) {

    if (!(room in historyMessage)) {
      historyMessage[room] = [];
    }

    // send history message to user

    console.log(historyMessage[room])

    socket.emit('history-message', historyMessage[room]);

    // add user to list user by room
    const user = {
      id: socket.id,
      username,
      room,
    };

    arrUser.push(user);

    const userListByRoom = arrUser.filter((ele) => {
      return ele.room === room;
    });

    io.to(room).emit('refresh-user', userListByRoom);

    // receive message from client and emit to all user in room

    socket.on('send-message-to-room', (message, callback) => {
      // storage message
      const _message = generateMessage(message, socket.id, 'text');

      historyMessage[room].push(_message);

      io.to(room).emit('receive-message-on-room', _message);
      callback();
    });

    // handle share location
    socket.on('share-location', ({ longitude, latitude }) => {
      const urlLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
      io.to(room).emit('receive-location-sharing', generateMessage(urlLocation, socket.id, 'location'));
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnect ', socket.id);
    // remove user from list user
    arrUser = arrUser.filter((user) => {
      return socket.id !== user.id;
    });
  });
});

// [socket1, socket2, socket3]

const generateMessage = (message, socketId, type) => {
  return {
    user: arrUser.find((ele) => {
      return ele.id === socketId;
    }),
    message,
    type,
    time: moment().format('DD/MM/yyy - HH:mm:ss'),
  };
};
