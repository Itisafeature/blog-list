const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});

  response.status(200).json(users);
});

usersRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.password.length < 3) {
    return response.status(400).json({ error: 'password too short' });
  }

  const password = await bcrypt.hash(body.password, 12);

  const user = new User({
    username: body.username,
    name: body.name,
    password,
  });

  const savedUser = await user.save();

  response.status(201).json(user);
});

module.exports = usersRouter;
