const express = require("express");
const router = express.Router();

const { getMatches } = require("../controllers/matchController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, getMatches);

module.exports = router;