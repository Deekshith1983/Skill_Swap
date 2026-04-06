const Session = require("../Models/Session");
const User = require("../Models/User");

// POST /api/sessions/:id/review - Submit review for a session
exports.addReview = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const userId = req.user._id;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: "Score must be between 1 and 5" });
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "Completed") {
      return res.status(400).json({ message: "Can only review completed sessions" });
    }

    // Check if already reviewed
    if (session.ratings?.some(r => r.from.toString() === userId.toString())) {
      return res.status(409).json({ message: "You have already reviewed this session" });
    }

    // Determine reviewee
    const revieweeId = session.userA.toString() === userId.toString() ? session.userB : session.userA;

    // Add rating to session
    session.ratings = session.ratings || [];
    session.ratings.push({
      from: userId,
      score: parseInt(score),
      feedback: feedback || ''
    });

    await session.save();

    // Update reviewee's reviews
    const reviewee = await User.findById(revieweeId);
    if (!reviewee) {
      return res.status(404).json({ message: "Reviewee not found" });
    }

    reviewee.reviews.push({
      reviewer: userId,
      session: session._id,
      score: parseInt(score),
      feedback: feedback || ''
    });

    // Recalculate rating
    if (reviewee.reviews.length > 0) {
      const avgRating = reviewee.reviews.reduce((sum, r) => sum + r.score, 0) / reviewee.reviews.length;
      reviewee.rating = Math.round(avgRating * 10) / 10;
    }

    await reviewee.save();

    res.status(200).json({
      message: "Review submitted successfully",
      session: await session.populate('userA userB ratings.from', '-password')
    });
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};