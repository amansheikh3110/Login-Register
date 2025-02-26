// Load required modules
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./mongodb"); // Renamed variable for clarity

const app = express();

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up EJS as the view engine and define views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Route to render the login page
app.get("/login", (req, res) => {
  res.render("login");
});

// A simple ping route to test server response
app.get("/ping", (req, res) => {
  res.send("Server is responding to ping ...!");
});

// Route to render the signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// POST route to handle user signup
app.post("/signup", async (req, res) => {
  try {
    console.log("Signup data:", req.body);
    let { name, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Hash the password using bcrypt with a salt rounds value of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document in the database with the hashed password
    const userdata = await User.create({ name, password: hashedPassword });
    console.log("User created:", userdata);
    res.status(200).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// POST route to handle user login
app.post("/login", async (req, res) => {
  try {
    console.log("Login data:", req.body);
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      // If user not found, stop further execution
      return res.send({ message: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (isPasswordMatch) {
      // Render the home page upon successful login
      return res.render("home");
    } else {
      return res.send({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Start the server on port 8000
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
