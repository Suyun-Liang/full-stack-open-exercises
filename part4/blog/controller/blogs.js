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

// edit the blog content
blogRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const { title, author, url } = request.body;

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({
      error: "Blog not found",
    });
  }

  if (blog.user?.toString() !== user.id) {
    return response.status(403).json({
      error: "Not authorized to update this blog",
    });
  }

  if (
    typeof title !== "string" ||
    typeof author !== "string" ||
    typeof url !== "string"
  ) {
    return response.status(400).json({
      error: "Invalid blog data",
    });
  }

  blog.title = title;
  blog.author = author;
  blog.url = url;

  const updatedBlog = await blog.save();

  response.json(updatedBlog);
});

// like route: like on a blog
blogRouter.put(
  "/:id/likes/me",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const blogId = request.params.id;

    // find if the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    if (!blog.likes.some((userId) => userId.toString() === user.id)) {
      blog.likes.push(user.id);
    }

    const updatedBlog = await blog.save();
    response.status(200).json(updatedBlog);
  },
);

// like route: delete like on a blog
blogRouter.delete(
  "/:id/likes/me",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const blogId = request.params.id;

    // find if the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    blog.likes = blog.likes.filter((userId) => userId.toString() !== user.id);

    const updatedBlog = await blog.save();
    response.status(200).json(updatedBlog);
  },
);

module.exports = blogRouter;
