const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

describe('getting all', () => {
  test('blogs are return as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all of the blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blogs should have an id property', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('creating a blog', () => {
  test('creates a new valid blog', async () => {
    const blog = new Blog({
      title: 'Testing API',
      author: 'Edsger W. Dijkstra',
      url:
        'http://www.u.arizona.edu/~rubinson/copyright_violations/testing.html',
      likes: 5,
    });

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const res = await Blog.find({});
    const blogs = res.map(blog => blog.toJSON());
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

    const blogURLs = blogs.map(blog => blog.url);
    expect(blogURLs).toContain(blog.url);
  });

  test('does not create an invalid blog', async () => {
    const blog = new Blog({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });

    await api.post('/api/blogs').send(blog).expect(400);

    const res = await Blog.find({});
    const blogs = res.map(blog => blog.toJSON());
    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });

  test('likes property defaults to 0 if not given a start point', async () => {
    let blog = new Blog({
      title: 'Testing API w/no likes',
      author: 'Edsger W. Dijkstra',
      url:
        'http://www.u.arizona.edu/~rubinson/copyright_violations/testing-no-likes.html',
    });
    blog = await blog.save();

    const res = await Blog.find({});
    const blogs = res.map(blog => blog.toJSON());
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

    expect(blog.likes).toBe(0);
  });
});

describe('deleting a blog', () => {
  test('successfully deletes blog and return 204', async () => {
    const blogs = await Blog.find({});
    const blogToDelete = blogs[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const endBlogs = await Blog.find({});
    expect(endBlogs).toHaveLength(blogs.length - 1);

    const titles = endBlogs.map(blog => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('updating a blog', () => {
  test('correctly updates a valid blog', async () => {
    const blogs = await Blog.find({});
    const blogToUpdate = blogs[0];
    const blogUpdate = {
      likes: blogToUpdate.likes + 1,
    };
    await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send(blogUpdate)
      .expect(200);
    const updatedBlog = await Blog.findById(blogToUpdate.id);
    expect(updatedBlog.likes).toBe(blogUpdate.likes);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
