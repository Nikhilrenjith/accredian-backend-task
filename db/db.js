// db.js
const mongoose = require("mongoose");

// Replace 'your_database_uri' with your actual MongoDB connection string
const MONGODB_URI =
  "mongodb+srv://nikhil:nikhil@dashboard-cluster.9t93x8a.mongodb.net/task";

mongoose.connect(MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = mongoose;
