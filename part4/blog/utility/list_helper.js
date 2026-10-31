const Blog = require("../models/blog");

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];
const listWithManyBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

function dummy() {
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

async function blogsInDB() {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
}

module.exports = {
  listWithOneBlog,
  listWithManyBlogs,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDB,
};
