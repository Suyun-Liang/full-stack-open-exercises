const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const testHelper = require("../utility/test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const api = supertest(app);
let token;
let user;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secrete", 10);
  user = new User({
    username: "root",
    name: "Amanda",
    passwordHash,
  });
  await user.save();

  token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET,
  );

  const blogs = testHelper.initialBlogs.map((blog) => ({
    ...blog,
    user: user._id,
  }));
  const savedBlogs = await Blog.insertMany(blogs);

  user.blogs = savedBlogs.map((blog) => blog._id);
  await user.save();
});

describe("GET /api/blogs", () => {
  test("returns blogs as JSON", async () => {
    const res = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(res.body.length, testHelper.initialBlogs.length);
  });

  test("returns blogs with an id property", async () => {
    const res = await api.get("/api/blogs").expect(200);

    assert(res.body.length > 0);
    assert(res.body.every((blog) => Object.hasOwn(blog, "id")));
  });
});

describe("GET /api/blogs/:id", () => {
  test("returns a blog with a valid existing id", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blog = blogsAtStart[0];

    const res = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(res.body.id, blog.id);
    assert.strictEqual(res.body.title, blog.title);
    assert.strictEqual(res.body.author, blog.author);
    assert.strictEqual(res.body.url, blog.url);
    assert.deepStrictEqual(res.body.likes, blog.likes);

    // Check populated user
    assert.strictEqual(res.body.user.id, blog.user.toString());
    assert.strictEqual(res.body.user.username, user.username);
    assert.strictEqual(res.body.user.name, user.name);
  });
  test("returns 404 when the blog does not exist", async () => {
    // valid id, but not exist in db
    const nonExistingId = await testHelper.nonExistingId();
    await api.get(`/api/blogs/${nonExistingId}`).expect(404);
  });

  test("returns 400 when the id is malformed", async () => {
    // malformed id
    const malformedId = "kkkkk";
    await api.get(`/api/blogs/${malformedId}`).expect(400);
  });
});

describe("POST /api/blogs", () => {
  test("creates a blog with valid data", async () => {
    const postsAtStart = await testHelper.blogsInDB();
    const newBlog = {
      title: "ttssssssttt",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const postsAtEnd = await testHelper.blogsInDB();
    assert.strictEqual(postsAtEnd.length, postsAtStart.length + 1);

    const titles = postsAtEnd.map((post) => post.title);
    assert(titles.includes(newBlog.title));

    // blog is added in user.blogs as well
    const userAtEnd = await User.findOne({ username: "root" });
    const createdBlog = postsAtEnd.find((blog) => blog.title === newBlog.title);
    assert(userAtEnd.blogs.some((id) => id.toString() === createdBlog.id));
  });
  describe("when required properties are missing", () => {
    test("returns 401 when token is missing", async () => {
      const newBlog = {
        title: "Test blog",
        url: "https://example.com",
      };

      await api.post("/api/blogs").send(newBlog).expect(401);
    });

    test("returns 401 when token is invalid", async () => {
      const newBlog = {
        title: "Test blog",
        url: "https://example.com",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", "Bearer invalid-token")
        .send(newBlog)
        .expect(401);
    });

    test("returns 400 when title is missing", async () => {
      const newBlog = {
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test("returns 400 when url is missing", async () => {
      const newBlog = {
        title: "bello",
        author: "Edsger W. Dijkstra",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });
  });
});

describe("DELETE /api/blogs/:id", () => {
  test("deletes a blog with a valid id", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await testHelper.blogsInDB();

    const ids = blogsAtEnd.map((b) => b.id);
    assert(!ids.includes(blogToDelete.id));

    assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length - 1);

    // blog in user.blogs also being deleted
    const userAtEnd = await User.findOne({ username: "root" });
    assert(!userAtEnd.blogs.some((id) => id.toString() === blogToDelete.id));
  });

  test("returns 401 when token is missing", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    await api.delete(`/api/blogs/${blogsAtStart[0].id}`).expect(401);
  });

  test("cannot delete a blog owned by another user", async () => {
    const blogsAtStart = await testHelper.blogsInDB();

    // 1. Create another user
    const passwordHash = await bcrypt.hash("secrete", 10);
    const newUser = new User({
      username: "fake",
      name: "Amanda",
      passwordHash,
    });
    await newUser.save();
    // 2. Generate a valid token for that user
    const otherToken = jwt.sign(
      { username: newUser.username, id: newUser._id },
      process.env.SECRET,
    );
    // 3. Try to delete a blog owned by root, Expect 403
    await api
      .delete(`/api/blogs/${blogsAtStart[0].id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(403);
    // 4. Verify the blog still exists in the database
    const blogsAtEnd = await testHelper.blogsInDB();

    assert.deepStrictEqual(blogsAtStart, blogsAtEnd);
  });
});

describe("PUT /api/blogs/:id", () => {
  test("updates a blog with valid data", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      title: "New Title",
      author: blogToUpdate.author,
      url: blogToUpdate.url,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.title, updatedData.title);

    const blogsAtEnd = await testHelper.blogsInDB();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);

    assert.strictEqual(updatedBlog.title, updatedData.title);
  });

  test("returns 400 when required fields are missing", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Title" })
      .expect(400);
  });

  test("returns 401 when token is missing", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      title: "New Title",
      author: blogToUpdate.author,
      url: blogToUpdate.url,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(401);
  });

  test("cannot update a blog owned by another user", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      title: "New Title",
      author: blogToUpdate.author,
      url: blogToUpdate.url,
    };

    const passwordHash = await bcrypt.hash("secrete", 10);
    const newUser = new User({
      username: "fake",
      name: "Amanda",
      passwordHash,
    });
    await newUser.save();

    const otherToken = jwt.sign(
      { username: newUser.username, id: newUser._id },
      process.env.SECRET,
    );

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send(updatedData)
      .expect(403);

    const blogsAtEnd = await testHelper.blogsInDB();

    assert.deepStrictEqual(blogsAtStart, blogsAtEnd);
  });
});

describe("PUT /api/blogs/:id/likes/me", () => {
  test("like a blog with a existing user", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToLike = blogsAtStart[0];

    const res = await api
      .put(`/api/blogs/${blogToLike.id}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert(res.body.likes.some((id) => id.toString() === user._id.toString()));
    assert.strictEqual(res.body.likes.length, blogToLike.likes.length + 1);

    const blogsAtEnd = await testHelper.blogsInDB();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToLike.id);
    assert(
      updatedBlog.likes.some((id) => id.toString() === user._id.toString()),
    );
    assert.strictEqual(updatedBlog.likes.length, res.body.likes.length);
  });

  test("liking a blog twice does not increase the like count twice", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToLike = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToLike.id}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const res = await api
      .put(`/api/blogs/${blogToLike.id}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert(res.body.likes.some((id) => id.toString() === user._id.toString()));
    assert.strictEqual(res.body.likes.length, blogToLike.likes.length + 1);

    const blogsAtEnd = await testHelper.blogsInDB();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToLike.id);
    assert(
      updatedBlog.likes.some((id) => id.toString() === user._id.toString()),
    );
    assert.strictEqual(updatedBlog.likes.length, res.body.likes.length);
  });

  test("returns 404 when blog does not exist", async () => {
    const nonExistingId = await testHelper.nonExistingId();
    await api
      .put(`/api/blogs/${nonExistingId}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });

  test("returns 401 when token is missing", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToLike = blogsAtStart[0];
    await api
      .put(`/api/blogs/${blogToLike.id}/likes/me`)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

describe("DELETE /api/blogs/:id/likes/me", () => {
  test("unlike a blog with a existing user", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToLike = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToLike.id}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const res = await api
      .delete(`/api/blogs/${blogToLike.id}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert(!res.body.likes.some((id) => id.toString() === user._id.toString()));
    assert.strictEqual(res.body.likes.length, blogToLike.likes.length);

    const blogsAtEnd = await testHelper.blogsInDB();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToLike.id);
    assert.deepStrictEqual(updatedBlog.likes, res.body.likes);
    assert.strictEqual(updatedBlog.likes.length, res.body.likes.length);
  });

  test("unlike a blog twice does not decrease the like count twice", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToLike = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToLike.id}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const resAfterFirstUnlike = await api
      .delete(`/api/blogs/${blogToLike.id}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const resAfterSecondUnlike = await api
      .delete(`/api/blogs/${blogToLike.id}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert(
      !resAfterSecondUnlike.body.likes.some(
        (id) => id.toString() === user._id.toString(),
      ),
    );
    assert.deepStrictEqual(
      resAfterFirstUnlike.body.likes,
      resAfterSecondUnlike.body.likes,
    );

    const blogsAtEnd = await testHelper.blogsInDB();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToLike.id);
    assert.deepStrictEqual(updatedBlog.likes, resAfterSecondUnlike.body.likes);
  });

  test("returns 404 when blog does not exist", async () => {
    const nonExistingId = await testHelper.nonExistingId();
    await api
      .delete(`/api/blogs/${nonExistingId}/likes/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });

  test("returns 401 when token is missing", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToLike = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToLike.id}/likes/me`)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

after(async () => {
  await mongoose.connection.close();
});
