const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const movieRoutes = require("./routes/movieRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/movies", movieRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🎬 Movie Watchlist API is Running...");
});

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  family: 4
})
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });