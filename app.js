const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const config = require('./utils/config');

mongoose.connect(config.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(400);
    res.json({ error: err.message });
  } else if (err.name === 'MongoError' && err.code === 11000) {
    res
      .status(422)
      .send({ status: 'failed', message: 'Username already exists' });
  }
  next(err);
});

module.exports = app;
