const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const testHelper = require("../utility/test_helper");
const Blog = require("../models/blog");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(testHelper.initialBlogs);
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
  test("returns a blog with a valid existing id ", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blog = blogsAtStart[0];
    const res = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(res.body, blog);
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
    const newBlog = {
      title: "ttssssssttt",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
    };

    await api.post("/api/blogs").send(newBlog).expect(201);

    const postsAtEnd = await testHelper.blogsInDB();
    assert.strictEqual(postsAtEnd.length, testHelper.initialBlogs.length + 1);

    const titles = postsAtEnd.map((post) => post.title);
    assert(titles.includes(newBlog.title));
  });
  describe("when required properties are missing", () => {
    test("defaults likes to 0 when omitted", async () => {
      const newBlog = {
        title: "belloooo",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      };

      const res = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
      assert.strictEqual(res.body.likes, 0);
    });

    test("returns 400 when title is missing", async () => {
      const newBlog = {
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
    });

    test("returns 400 when url is missing", async () => {
      const newBlog = {
        title: "bello",
        author: "Edsger W. Dijkstra",
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
    });
  });
});

describe("DELETE /api/blogs/:id", () => {
  test("deletes a blog with a valid id", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await testHelper.blogsInDB();

    const ids = blogsAtEnd.map((b) => b.id);
    assert(!ids.includes(blogToDelete.id));

    assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length - 1);
  });
});

describe("PUT /api/blogs/:id", () => {
  test("updates a blog with a valid id", async () => {
    const blogsAtStart = await testHelper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];
    const updateField = {
      likes: blogToUpdate.likes + 1,
    };
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateField)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, updateField.likes);

    const blogAtEnd = await testHelper.blogsInDB();
    const updatedBlog = blogAtEnd.find((b) => b.id === blogToUpdate.id);

    assert.strictEqual(updatedBlog.likes, updateField.likes);
  });
});

after(async () => {
  await mongoose.connection.close();
});
