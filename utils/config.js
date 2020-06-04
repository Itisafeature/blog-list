require('dotenv').config();

let MONGO_DB_URI = process.env.MONGO_DB_URI;
let DB_PASSWORD = process.env.DB_PASSWORD;
let PORT = process.env.PORT;

module.exports = {
  MONGO_DB_URI,
  DB_PASSWORD,
  PORT,
};
