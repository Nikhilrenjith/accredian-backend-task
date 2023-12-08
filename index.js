const express = require("express");
const mongoose = require("./db/db");
const bodyParser = require("body-parser");
const User = require("./db/userModel");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 5000;
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

    // You can generate a token here and send it back to the client for authentication

    res.json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
