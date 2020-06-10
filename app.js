const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

mongoose.connect(config.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use(middleware.getJwtToken);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (err.name === 'MongoError' && err.code === 11000) {
    return res
      .status(422)
      .send({ status: 'failed', message: 'Username already exists' });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    });
  }
  next(err);
});

module.exports = app;
