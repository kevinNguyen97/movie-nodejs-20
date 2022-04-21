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

io.on('connection', (socket) => {
  console.log('new connection', socket.id);

  socket.on('disconnect', () => {
    console.log('disconnect ', socket.id);
  });
});


// [socket1, socket2, socket3]