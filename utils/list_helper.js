const _ = require('lodash');

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const reducer = (a, b) => {
    return a + b.likes;
  };
  return blogs.length < 1
    ? 0
    : blogs.length < 2
    ? blogs[0].likes
    : blogs.reduce(reducer, 0);
};

const favoriteBlog = blogs => {
  if (blogs.length < 1) return undefined;
  const likes = blogs.map(blog => blog.likes);
  const max = Math.max(...likes);
  const result = blogs.find(el => el.likes === max);
  return { title: result.title, author: result.author, likes: result.likes };
};

const mostBlogs = blogs => {
  if (blogs.length < 1) return undefined;

  const authorBlogs = _.reduce(
    blogs,
    function (result, value, key) {
      if (result[value.author]) {
        result[value.author] += 1;
      } else {
        result[value.author] = 1;
      }
      return result;
    },
    {}
  );

  let obj = [];
  for (const key in authorBlogs) {
    obj.push({ author: key, blogs: authorBlogs[key] });
  }
  return obj.sort((a, b) => b.blogs - a.blogs)[0];
};

const mostLikes = blogs => {
  if (blogs.length < 1) return undefined;
  const authorBlogs = _.reduce(
    blogs,
    function (result, value, key) {
      if (result[value.author]) {
        result[value.author] += value.likes;
      } else {
        result[value.author] = value.likes;
      }
      return result;
    },
    {}
  );

  let obj = [];
  for (const key in authorBlogs) {
    obj.push({ author: key, likes: authorBlogs[key] });
  }
  return obj.sort((a, b) => b.likes - a.likes)[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
