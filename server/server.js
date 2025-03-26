const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
console.log("Attempting to connect to MongoDB...");

// MongoDB connection options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

mongoose
  .connect(process.env.MONGODB_URI, mongoOptions)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.error("Connection string used (redacted password):", 
      process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
  });

// Routes
const pointsRouter = require("./routes/points");
const counterRouter = require("./routes/counter");

app.use("/api/points", pointsRouter);
app.use("/api/counter", counterRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
