const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utility/list_helpers");

describe("most blogs", () => {
  test("of empty list is null", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog, equals the likes of that author", () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 5 });
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.mostLikes(listHelper.listWithManyBlogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 });
  });
});
