const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utility/list_helper");

test("dummy returns 1 regardless of input", () => {
  const blog = [];
  const result = listHelper.dummy(blog);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("returns null for an empty list", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("returns blogs with the total likes", () => {
    const result = listHelper.totalLikes(listHelper.listWithManyBlogs);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("returns null for an empty list", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, equals the blog of that", () => {
    const result = listHelper.favoriteBlog(listHelper.listWithOneBlog);
    assert.deepStrictEqual(result, listHelper.listWithOneBlog[0]);
  });

  test("returns the blog with the most likes", () => {
    const result = listHelper.favoriteBlog(listHelper.listWithManyBlogs);
    assert.deepStrictEqual(result, listHelper.listWithManyBlogs[2]);
  });
});

describe("most blogs", () => {
  test("returns null for an empty list", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, equals the blog of that author", () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 1 });
  });

  test("returns the author with the most blogs", () => {
    const result = listHelper.mostBlogs(listHelper.listWithManyBlogs);
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 });
  });
});

describe("most likes", () => {
  test("returns null for an empty list", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, equals the likes of that author", () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 5 });
  });

  test("returns the author with the highest total likes", () => {
    const result = listHelper.mostLikes(listHelper.listWithManyBlogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 });
  });
});
