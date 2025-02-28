const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./mongodb"); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/ping", (req, res) => {
  res.send("Server is responding to ping ...!");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  try {
    console.log("Signup data:", req.body);
    let { name, password } = req.body;

    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userdata = await User.create({ name, password: hashedPassword });
    console.log("User created:", userdata);
    res.status(200).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("Login data:", req.body);
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.send({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (isPasswordMatch) {
      return res.render("home");
    } else {
      return res.send({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
