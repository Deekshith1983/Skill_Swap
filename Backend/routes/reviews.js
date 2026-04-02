const express = require("express");
const router = express.Router();

const { addReview } = require("../controllers/reviewController");
const auth = require("../middleware/auth");

router.post("/:id/review", auth, addReview);

module.exports = router;