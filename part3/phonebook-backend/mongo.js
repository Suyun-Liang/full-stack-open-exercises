const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const URL = `mongodb+srv://lsyxxl123_db_user:${password}@cluster0.aiskmfq.mongodb.net/`;

mongoose.set("strictQuery", false);
mongoose.connect(URL, { family: 4 });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name,
  number,
});

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log(persons);
    mongoose.connection.close();
  });
} else {
  person.save().then(() => {
    console.log(`added ${name} number ${number} to person db`);
    mongoose.connection.close();
  });
}
