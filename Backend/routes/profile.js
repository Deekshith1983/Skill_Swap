const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getMyProfile, getProfileById, updateProfile, uploadProfilePic } = require("../controllers/profileController");

// Get current user's profile
router.get("/me", authMiddleware, getMyProfile);

// Get other user's profile
router.get("/:id", authMiddleware, getProfileById);

// Update profile
router.put("/:id", authMiddleware, updateProfile);

// Upload profile picture
router.patch("/me/picture", authMiddleware, uploadProfilePic);

module.exports = router;