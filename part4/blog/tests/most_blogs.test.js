const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utility/list_helpers");

describe("most blogs", () => {
  test("of empty list is null", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, equals the blog of that author", () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 1 });
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.mostBlogs(listHelper.listWithManyBlogs);
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 });
  });
});
