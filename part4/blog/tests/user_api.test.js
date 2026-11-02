const { describe, test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const testHelper = require("../utility/test_helper");

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("secrete", 10);
  const user = new User({
    username: "root",
    name: "Amanda",
    passwordHash,
  });
  await user.save();
});

describe("POST /api/users/", () => {
  test("create a user with a valid data", async () => {
    const usersAtStart = await testHelper.usersInDB();
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await testHelper.usersInDB();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    assert(usernames.includes(newUser.username));
  });
});

after(async () => {
  mongoose.connection.close();
});
