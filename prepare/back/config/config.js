const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  "development": {
    "username": "study",
    "password":process.env.DB_PASSWORD,
    "database": "react_nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "study",
    "password":process.env.DB_PASSWORD,
    "database": "react_nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "study",
    "password":process.env.DB_PASSWORD,
    "database": "react_nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
