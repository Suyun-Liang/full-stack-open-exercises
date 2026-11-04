const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
}

function tokenExtractor(request, response, next) {
  const authorization = request.get("authorization");
  request.token = null;
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }

  next();
}

async function userExtractor(request, response, next) {
  request.user = null;
  // tokenExtractor function muss be run before userExtractor so that we can access request.token
  if (!request.token) {
    return response.status(401).json({
      error: "Token missing",
    });
  }

  const decodedPayload = jwt.verify(request.token, process.env.SECRET);
  if (!decodedPayload.id) {
    return response.status(401).json({
      error: "Invalid token",
    });
  }

  const user = await User.findById(decodedPayload.id);
  if (!user) {
    return response.status(401).json({
      error: "User not found",
    });
  }

  request.user = user;

  next();
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
