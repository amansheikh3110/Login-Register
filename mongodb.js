const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/users");

connect.then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
