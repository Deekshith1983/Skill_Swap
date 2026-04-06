const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { createSession, getMySessions, getSessionById, updateSessionStatus, rescheduleSession, submitReview } = require("../controllers/sessionController");

// Test route - verify reschedule endpoint exists
router.get("/health/reschedule", (req, res) => {
  res.json({ message: "✅ Reschedule endpoint is available" });
});

// Create scheduled session
router.post("/create", authMiddleware, createSession);

// Get all sessions for current user
router.get("/mine", authMiddleware, getMySessions);

// More specific routes MUST come before generic /:id route
// Reschedule session (allows unlimited reschedules)
router.patch("/:id/reschedule", authMiddleware, (req, res, next) => {
  console.log("🔄 Reschedule request:", { id: req.params.id, body: req.body });
  next();
}, rescheduleSession);

// Update session status
router.patch("/:id/status", authMiddleware, updateSessionStatus);

// Submit review for session
router.post("/:id/review", authMiddleware, submitReview);

// Get single session (generic route - MUST be last)
router.get("/:id", authMiddleware, getSessionById);

module.exports = router;