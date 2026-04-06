const User = require("../Models/User");

// GET /api/match - Complementary skill matching
exports.getMatches = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId).select("-password");

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const mySkillsOffered = currentUser.skillsOffered || [];
    const mySkillsNeeded = currentUser.skillsNeeded || [];

    // Find users with complementary skills
    const otherUsers = await User.find({
      _id: { $ne: currentUserId },
      skillsOffered: { $in: mySkillsNeeded },
      skillsNeeded: { $in: mySkillsOffered }
    }).select("-password");

    // Compute match scores
    const matches = otherUsers
      .map((user) => {
        const theirSkillsOffered = user.skillsOffered || [];
        const theirSkillsNeeded = user.skillsNeeded || [];

        const offeredMatch = mySkillsNeeded.filter((skill) =>
          theirSkillsOffered.some(s => s.toLowerCase() === skill.toLowerCase())
        );

        const neededMatch = mySkillsOffered.filter((skill) =>
          theirSkillsNeeded.some(s => s.toLowerCase() === skill.toLowerCase())
        );

        const matchScore = offeredMatch.length + neededMatch.length;

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          college: user.college,
          profilePic: user.profilePic,
          bio: user.bio,
          skillsOffered: user.skillsOffered,
          skillsNeeded: user.skillsNeeded,
          experienceLevel: user.experienceLevel,
          rating: user.rating,
          sessionHistory: user.sessionHistory,
          offeredMatch,
          neededMatch,
          matchScore
        };
      })
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        return (b.rating || 0) - (a.rating || 0);
      });

    res.status(200).json({
      total: matches.length,
      users: matches,
      mode: 'match'
    });
  } catch (error) {
    console.error("MATCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};