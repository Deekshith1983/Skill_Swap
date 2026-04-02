const Session = require("../Models/Session");
const User = require("../Models/User");

//  ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const userId = req.user.id;

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "Completed") {
      return res.status(400).json({
        message: "Review allowed only after completion",
      });
    }

    // Save review in session
    session.ratings.push({
      user: userId,
      rating,
      feedback,
    });

    await session.save();

    // Find other user
    const targetUserId = session.users.find(
      (u) => u.toString() !== userId
    );

    const user = await User.findById(targetUserId);

    // Save review in user
    user.reviews.push({
      from: userId,
      rating,
      feedback,
    });

    // Recalculate average rating
    const total = user.reviews.reduce((sum, r) => sum + r.rating, 0);
    user.rating = total / user.reviews.length;

    await user.save();

    res.json({ message: "Review added successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};