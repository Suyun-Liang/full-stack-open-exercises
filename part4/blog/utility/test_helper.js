const Blog = require("../models/blog");
const Users = require("../models/user");
const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: [],
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: [],
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: [],
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: [],
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: [],
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: [],
    __v: 0,
  },
];

async function blogsInDB() {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
}

async function nonExistingId() {
  // newBlog will be added _id and __v keys automatically by mongoose;
  const newBlog = new Blog({
    title: "will be delete",
    author: "Amanda",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  });
  await newBlog.save();
  await newBlog.deleteOne();

  return newBlog._id.toString();
}

async function usersInDB() {
  const users = await Users.find({});
  return users.map((user) => user.toJSON());
}

module.exports = {
  initialBlogs,
  blogsInDB,
  nonExistingId,
  usersInDB,
};
