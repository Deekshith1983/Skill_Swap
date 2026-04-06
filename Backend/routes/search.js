const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { searchUsers, getSkillSuggestions } = require("../controllers/searchController");

// Search users
router.get("/", authMiddleware, searchUsers);

// Get skill suggestions
router.get("/suggestions", authMiddleware, getSkillSuggestions);

module.exports = router;
