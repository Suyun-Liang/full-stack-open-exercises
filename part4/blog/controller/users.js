const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  if (users) {
    response.json(users);
  } else {
    response.status(404).end();
  }
});

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: "Password must be at least 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

userRouter.delete("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user) {
    await User.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

module.exports = userRouter;
