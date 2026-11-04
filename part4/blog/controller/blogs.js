const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utility/middleware");

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

blogRouter.post("/", middleware.userExtractor, async (request, response) => {
  const user = request.user;

  const blog = new Blog({ ...request.body, user: user._id });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({
        error: "Blog not found",
      });
    }

    const authorizedUser = blog.user?.toString() === user.id;
    if (!authorizedUser) {
      return response
        .status(403)
        .json({ error: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    await User.findByIdAndUpdate(blog.user, { $pull: { blogs: blog._id } });
    response.status(204).end();
  },
);

blogRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const body = request.body;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    response.status(404).json({
      error: "Blog not found",
    });
  }

  const authorizedUser = blog.user?.toString() === user.id;
  if (!authorizedUser) {
    return response
      .status(403)
      .json({ error: "Not authorized to delete this blog" });
  }

  for (const key in body) {
    if (Object.hasOwn(blog.toObject(), key)) blog[key] = body[key];
  }
  const updatedBlog = await blog.save();
  response.json(updatedBlog);
});

module.exports = blogRouter;
