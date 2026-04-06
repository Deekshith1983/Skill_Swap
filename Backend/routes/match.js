const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getMatches } = require("../controllers/matchController");

// Get complementary skill matches
router.get("/", authMiddleware, getMatches);

module.exports = router;