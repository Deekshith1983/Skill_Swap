require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// (optional - your teammate work)
app.use("/sessions", require("./routes/sessions"));
app.use("/reviews", require("./routes/reviews"));

// ================= DB CONNECTION =================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});