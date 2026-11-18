const testingRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

testingRouter.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

testingRouter.post("/blogs", async (request, response) => {
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();

  response.status(201).json(savedBlog);
});

module.exports = testingRouter;
