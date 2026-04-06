require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// ================= DB CONNECTION =================
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skillswap")
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

// ================= ROUTES =================
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const matchRoutes = require("./routes/match");
const searchRoutes = require("./routes/search");
const requestRoutes = require("./routes/requests");
const sessionRoutes = require("./routes/sessions");
const reviewRoutes = require("./routes/reviews");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.json({ message: "✅ API is running on port " + process.env.PORT });
});

// ================= ERROR HANDLING =================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ 
    message: err.message || "Server error" 
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});