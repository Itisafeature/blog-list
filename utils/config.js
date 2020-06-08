require('dotenv').config();

let MONGO_DB_URI = process.env.MONGO_DB_URI;
let PORT = process.env.PORT;

if (process.env.NODE_ENV === 'test') {
  MONGO_DB_URI = process.env.TEST_MONGO_DB_URI;
}

module.exports = {
  MONGO_DB_URI,
  PORT,
};
