const { test } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utility/list_helpers");

test("dummy returns 1", () => {
  const blog = [];
  const result = listHelper.dummy(blog);
  assert.strictEqual(result, 1);
});
