require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT;
const Person = require("./models/person");
morgan.token("body", (req, res) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/api/persons", (req, res, next) => {
  // res.json(persons);
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  // if (!body.name) return res.status(400).json({ error: "name missing" });
  // if (!body.number) return res.status(400).json({ error: "number missing" });

  Person.find({ name: body.name })
    .then((result) => {
      if (result.length > 0)
        return res.status(400).json({ error: "name has already exist in db" });

      const person = new Person({
        name: body.name,
        number: body.number,
      });

      return person.save().then((savedPerson) => {
        res.json(savedPerson);
      });
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;
  Person.findById(id)
    .then((person) => {
      if (!person) return res.status(404).end();

      person.name = name;
      person.number = number;

      return person.save().then((savedPerson) => {
        res.json(savedPerson);
      });
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(
        `<p>phone book has info for ${persons.length} people</p> <p>${new Date()}</p>`,
      );
    })
    .catch((error) => next(error));
});

function unknownEndpoint(request, response) {
  response.status(404).json({ error: "unknown endpoint" });
}
app.use(unknownEndpoint);

function errorHandler(error, request, response, next) {
  console.log("error name: ", error.name);
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
}
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function getRandomId() {
  return Math.floor(Math.random() * 100000).toString();
}
