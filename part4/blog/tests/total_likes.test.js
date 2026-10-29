const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utility/list_helpers");

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(listHelper.listWithManyBlogs);
    assert.strictEqual(result, 36);
  });
});
