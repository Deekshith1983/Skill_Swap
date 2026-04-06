const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { sendRequest, getIncomingRequests, getSentRequests, acceptRequest, rejectRequest, getAcceptedRequest } = require("../controllers/requestController");

// Send connection request
router.post("/send", authMiddleware, sendRequest);

// Get incoming requests
router.get("/incoming", authMiddleware, getIncomingRequests);

// Get sent requests
router.get("/sent", authMiddleware, getSentRequests);

// Get accepted request with specific user
router.get("/accepted/:userId", authMiddleware, getAcceptedRequest);

// Accept request
router.put("/:id/accept", authMiddleware, acceptRequest);

// Reject request
router.put("/:id/reject", authMiddleware, rejectRequest);

module.exports = router;