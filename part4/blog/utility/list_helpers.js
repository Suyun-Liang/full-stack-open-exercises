function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  return blogs.reduce((acc, cur) => {
    return (acc += cur.likes);
  }, 0);
}

function favoriteBlog(blogs) {
  if (blogs.length === 0) return null;
  let result;
  let max = 0;
  blogs.forEach((blog) => {
    if (blog.likes > max) {
      max = blog.likes;
      result = blog;
    }
  });
  return result;
}

//{"john":2,....}
function mostBlogs(blogs) {
  if (blogs.length === 0) return null;
  const result = { author: null, blogs: 0 };
  const authorBlogs = blogs.reduce((acc, cur) => {
    const authorName = cur.author;
    acc[authorName] = (acc[authorName] ?? 0) + 1;
    return acc;
  }, {});

  for (const name in authorBlogs) {
    if (authorBlogs[name] > result.blogs) {
      result.author = name;
      result.blogs = authorBlogs[name];
    }
  }

  return result;
}

function mostLikes(blogs) {
  if (blogs.length === 0) return null;
  // likes can be 0;
  const result = { author: null, likes: -Infinity };
  const authorLikes = blogs.reduce((acc, cur) => {
    const authorName = cur.author;
    acc[authorName] = (acc[authorName] ?? 0) + cur.likes;
    return acc;
  }, {});

  for (const name in authorLikes) {
    if (authorLikes[name] > result.likes) {
      result.author = name;
      result.likes = authorLikes[name];
    }
  }

  return result;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
