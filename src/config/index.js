const config = {
  development: {
    username: 'root',
    password: '123456788',
    database: 'project_movie',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  AUTH: {
    SECRET_KEY: 'nodejs-20',
  },
  SYSTEM: {
    PORT: 3000,
    HOST: '',
    DOMAIN: 'http://localhos',
  },
};

module.exports = config;
