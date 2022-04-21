'use strict';
const express = require('express');
const { sequelize } = require('./src/models');
const { logger } = require('./src/middlewares/logger');
const path = require('path');

const rootRouter = require('./src/routers');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./src/graphql/schema');
const graphqlResolvers = require('./src/graphql/resolvers');

const app = express();

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

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });





const port = 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
