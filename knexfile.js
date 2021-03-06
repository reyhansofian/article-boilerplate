var dotenv = require('dotenv');

dotenv.load();

module.exports = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  debug: process.env.NODE_ENV !== 'production' || false
};
