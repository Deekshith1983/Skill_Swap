const express = require("express");
const router = express.Router();

const {
  getMySessions,
  getSessionById,
  updateSessionStatus,
} = require("../controllers/sessionController");

const auth = require("../middleware/auth");

//  ROUTES
router.get("/mine", auth, getMySessions);
router.get("/:id", auth, getSessionById);
router.patch("/:id/status", auth, updateSessionStatus);

module.exports = router;