const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/users");

connect.then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Define a schema for users with 'name' and 'password' fields
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


// Create a Mongoose model based on the schema; note the model name is 'User'
const User = mongoose.model("users", userSchema);

// Export the model for use in other files
module.exports = User;
