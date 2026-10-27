const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (req, res, next) => {
  // res.json(persons);
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

personsRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

personsRouter.post("/", (req, res, next) => {
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

personsRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

personsRouter.put("/:id", (req, res, next) => {
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

personsRouter.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(
        `<p>phone book has info for ${persons.length} people</p> <p>${new Date()}</p>`,
      );
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
