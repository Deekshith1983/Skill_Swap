const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { register, login } = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route - get current user
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Authorized user",
    user: req.user
  });
});

module.exports = router;