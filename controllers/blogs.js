const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.status(200).json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({
      error: 'invalid token',
    });
  }

  const newBlog = new Blog({
    likes: body.likes,
    title: body.title,
    author: body.author,
    url: body.url,
    user: decodedToken.id,
  });

  const savedBlog = await newBlog.save();
  response.status(201).json(savedBlog);
});

blogRouter.patch('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
      runValidators: true,
    }
  );
  response.status(200).json(updatedBlog.toJSON());
});

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({
      error: 'invalid token',
    });
  }
  const blogToBeDeleted = await Blog.findById(request.params.id);
  if (blogToBeDeleted.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    return response.status(401).json({
      error: 'You are not authorized to delete this blog',
    });
  }
});

module.exports = blogRouter;
