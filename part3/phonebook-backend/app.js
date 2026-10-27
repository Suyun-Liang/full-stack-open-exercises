const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const config = require("./utils/config");
const logger = require("./utils/logger");
const personsRouter = require("./controller/persons");
const middleware = require("./utils/middleware");
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.static("dist")); // when run backend,first fetch the file from "dist"
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.use("/api/persons", personsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
