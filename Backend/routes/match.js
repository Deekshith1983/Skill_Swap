const express = require("express");
const router = express.Router();

const { getMatches, searchMatches } = require("../controllers/matchController");
const authMiddleware = require("../middleware/auth");

// automatic profile-based mutual matching
router.get("/", authMiddleware, getMatches);

// search bar based matching
router.get("/search", authMiddleware, searchMatches);

module.exports = router;