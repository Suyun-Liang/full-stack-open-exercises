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
  // const users = [
  //   {
  //     username: "root",
  //     name: "Amanda",
  //     passwordHash,
  //   },
  //   { username: "root2", name: "Hello", passwordHash },
  // ];
  // await User.insertMany(users);
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

  describe("create user with invalid data", () => {
    test("returns 400 when username is missing", async () => {
      const usersAtStart = await testHelper.usersInDB();
      const newUser = {
        name: "Matti Luukkainen",
        password: "salainen",
      };
      const res = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await testHelper.usersInDB();
      assert.deepStrictEqual(usersAtEnd, usersAtStart);

      assert.match(res.body.error, /Path `username` is required/);
    });
    test("returns 400 when username is shorter than 3 characters", async () => {
      const usersAtStart = await testHelper.usersInDB();
      const newUser = {
        username: "ml",
        name: "Matti Luukkainen",
        password: "salainen",
      };
      const res = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await testHelper.usersInDB();
      assert.deepStrictEqual(usersAtEnd, usersAtStart);

      assert.match(
        res.body.error,
        /username.*shorter than the minimum allowed length/,
      );
    });
    test("returns 400 when password is missing", async () => {
      const usersAtStart = await testHelper.usersInDB();
      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
      };
      const res = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await testHelper.usersInDB();
      assert.deepStrictEqual(usersAtEnd, usersAtStart);

      assert.match(
        res.body.error,
        /Password must be at least 3 characters long/,
      );
    });
    test("returns 400 when password is shorter than 3 characters", async () => {
      const usersAtStart = await testHelper.usersInDB();
      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "se",
      };
      const res = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await testHelper.usersInDB();
      assert.deepStrictEqual(usersAtEnd, usersAtStart);

      assert.match(
        res.body.error,
        /Password must be at least 3 characters long/,
      );
    });
    test("returns 400 when username already exists", async () => {
      const usersAtStart = await testHelper.usersInDB();
      const newUser = {
        username: "root",
        name: "Amanda",
        password: "hhhhhh",
      };
      const res = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await testHelper.usersInDB();
      assert.deepStrictEqual(usersAtEnd, usersAtStart);

      assert.match(res.body.error, /Username already exists in database/);
    });
  });
});

after(async () => {
  mongoose.connection.close();
});
