const express = require("express");
const mongoose = require("./db/db");
const bodyParser = require("body-parser");
const User = require("./db/userModel");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());

/* Connection status */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
/* Signup */
app.post("/api/signup", async (req, res) => {
  const { fname, lname, email, number, password, termsAndConditions } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      fname,
      lname,
      email,
      number,
      password: hashedPassword,
      termsAndConditions,
    });

    const savedUser = await newUser.save();

    res.json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.error("Error during account creation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/* Login */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
