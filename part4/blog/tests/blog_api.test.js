const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const listHelper = require("../utility/list_helpers");
const Blog = require("../models/blog");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(listHelper.listWithManyBlogs);
});

test("blogs are returned as json", async () => {
  const res = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(res.body.length, listHelper.listWithManyBlogs.length);
});

test("blogs are returned with id key name", async () => {
  const res = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(res.body.length, listHelper.listWithManyBlogs.length);
  assert(res.body.every((blog) => Object.hasOwn(blog, "id")));
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "ttssssssttt",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const postsAtEnd = await listHelper.blogsInDB();
  assert.strictEqual(
    postsAtEnd.length,
    listHelper.listWithManyBlogs.length + 1,
  );

  const titles = postsAtEnd.map((post) => post.title);
  assert(titles.includes(newBlog.title));
});

test("creating a blog with missing likes will be default to 0 likes", async () => {
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

describe("creating a blog with missing properties", () => {
  test("without title returns 400", async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("without url returns 400", async () => {
    const newBlog = {
      title: "bello",
      author: "Edsger W. Dijkstra",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
