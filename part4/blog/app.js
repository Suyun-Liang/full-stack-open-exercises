const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const blogRouter = require("./controller/blogs");
const logger = require("./utility/logger");
const config = require("./utility/config");
const app = express();
morgan.token("body", (req) => JSON.stringify(req.body));

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info("connected to db");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error);
  });

app.use(express.json());
app.use(express.urlencoded());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.use("/api/blogs", blogRouter);

module.exports = app;
