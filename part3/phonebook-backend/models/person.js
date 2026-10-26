const mongoose = require("mongoose");

const URL = process.env.MONGODB_URI;

console.log("connecting to", URL);
mongoose.set("strictQuery", false);
mongoose
  .connect(URL, { family: 4 })
  .then((res) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /^(?:\d{2}-\d{6,}|\d{3}-\d{5,})$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
