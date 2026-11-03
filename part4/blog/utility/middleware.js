const logger = require("./logger");

function unknownEndpoint(request, response) {
  response.status(404).json({ error: "unknown endpoint" });
}

function errorHandler(error, request, response, next) {
  logger.info("error name: ", error.name);
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError" && error.code === 11000) {
    return response
      .status(400)
      .json({ error: "Username already exists in database" });
  }

  next(error);
}

module.exports = { unknownEndpoint, errorHandler };
