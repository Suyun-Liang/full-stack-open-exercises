const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utility/list_helpers");

describe("favorite blog", () => {
  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, equals the blog of that", () => {
    const result = listHelper.favoriteBlog(listHelper.listWithOneBlog);
    assert.deepStrictEqual(result, listHelper.listWithOneBlog[0]);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.favoriteBlog(listHelper.listWithManyBlogs);
    assert.deepStrictEqual(result, listHelper.listWithManyBlogs[2]);
  });
});
