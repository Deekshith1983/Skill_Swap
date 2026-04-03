const Session = require("../Models/Session");
const User = require("../Models/User");

//  ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const userId = req.user.id;

    // Validate score
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: "Score must be between 1 and 5" });
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "Completed") {
      return res.status(400).json({
        message: "Review allowed only after completion",
      });
    }

    // Determine if user is userA or userB
    const isUserA = userId.toString() === session.userA.toString();
    const targetUserId = isUserA ? session.userB : session.userA;

    // Check if review already exists from this user
    const existingReview = session.ratings.find(
      (r) => r.from.toString() === userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this session" });
    }

    // Save review in session
    session.ratings.push({
      from: userId,
      // session: session._id,  // optional - already has parent
      score,
      feedback,
    });

    await session.save();

    // Save review in user
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    targetUser.reviews.push({
      reviewer: userId,
      reviewee: targetUserId,
      session: session._id,
      score,
      feedback,
    });

    // Recalculate average rating
    const totalScore = targetUser.reviews.reduce((sum, r) => sum + r.score, 0);
    targetUser.rating = totalScore / targetUser.reviews.length;

    await targetUser.save();

    res.json({ message: "Review added successfully", review: targetUser.reviews[targetUser.reviews.length - 1] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};