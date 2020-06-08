const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

let usersInDB;

beforeEach(async () => {
  await User.deleteMany({});

  const password = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', password });

  await user.save();
  usersInDB = await User.find({});
});

describe('creating users', () => {
  test('creates and saves a valid user to the database', async () => {
    const newUser = new User({
      username: 'test user 2',
      name: 'Peter',
      password: '1234',
    });

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const userResults = await User.find({});
    expect(userResults).toHaveLength(usersInDB.length + 1);

    const usernames = userResults.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('does not create a user without a username', async () => {
    const newUser = new User({
      name: 'Peter',
      password: '1234',
    });

    await api.post('/api/users/').send(newUser).expect(400);
    const userResults = await User.find({});
    expect(userResults).toHaveLength(usersInDB.length);
  });

  test('does not create a user with a duplicate username', async () => {
    const dupeUser = new User({
      username: 'root',
      name: 'Peter',
      password: '1234',
    });

    await api.post('/api/users/').send(dupeUser).expect(422);
    const userResults = await User.find({});
    expect(userResults).toHaveLength(usersInDB.length);
  });

  test('does not create a user without a valid password', async () => {
    const newUser = new User({
      username: 'test user 2',
      name: 'Peter',
      password: '12',
    });

    await api.post('/api/users/').send(newUser).expect(400);
    const userResults = await User.find({});
    expect(userResults).toHaveLength(usersInDB.length);

    const usernames = userResults.map(user => user.username);
    expect(usernames).not.toContain(newUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
