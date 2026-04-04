const express = require("express");
const router = express.Router();

const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getIncomingRequests
} = require("../controllers/requestController");

const auth = require("../middleware/auth");

// send request
router.post("/send", auth, sendRequest);

// accept
router.put("/:id/accept", auth, acceptRequest);

// reject
router.put("/:id/reject", auth, rejectRequest);

// incoming
router.get("/incoming", auth, getIncomingRequests);

module.exports = router;