// db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Replace 'your_database_uri' with your actual MongoDB connection string

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = mongoose;
