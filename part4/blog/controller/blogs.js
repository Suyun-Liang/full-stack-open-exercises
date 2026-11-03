const Blog = require("../models/blog");
const User = require("../models/user");

const blogRouter = require("express").Router();
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  if (blogs) {
    response.json(blogs);
  } else {
    response.status(404).end();
  }
});

blogRouter.get("/:id", async (request, response) => {
  const blogs = await Blog.findById(request.params.id);
  if (blogs) {
    response.json(blogs);
  } else {
    response.status(404).end();
  }
});

blogRouter.post("/", async (request, response) => {
  const user = await User.findOne({});
  const blog = new Blog({ ...request.body, user: user._id });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    for (const key in body) {
      if (Object.hasOwn(blog.toObject(), key)) blog[key] = body[key];
    }
    const updatedBlog = await blog.save();
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = blogRouter;
