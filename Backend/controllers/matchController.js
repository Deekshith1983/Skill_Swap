const User = require("../Models/User");

exports.getMatches = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // logged-in user
    const currentUser = await User.findById(currentUserId).select("-password");

    if (!currentUser) {
      return res.status(404).json({ msg: "Current user not found" });
    }

    const mySkillsOffered = currentUser.skillsOffered || [];
    const mySkillsNeeded = currentUser.skillsNeeded || [];

    // get all other users
    const otherUsers = await User.find({
      _id: { $ne: currentUserId }
    }).select("-password");

    const matches = otherUsers
      .map((user) => {
        const theirSkillsOffered = user.skillsOffered || [];
        const theirSkillsNeeded = user.skillsNeeded || [];

        // what I need that they offer
        const offeredMatch = mySkillsNeeded.filter((skill) =>
          theirSkillsOffered.includes(skill)
        );

        // what they need that I offer
        const neededMatch = mySkillsOffered.filter((skill) =>
          theirSkillsNeeded.includes(skill)
        );

        const overlapCount = offeredMatch.length + neededMatch.length;

        if (offeredMatch.length > 0 && neededMatch.length > 0) {
          return {
            user,
            matchedSkillsTheyOffer: offeredMatch,
            matchedSkillsTheyNeed: neededMatch,
            matchScore: overlapCount,
            rating: user.rating || 0
          };
        }

        return null;
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return (b.rating || 0) - (a.rating || 0);
      });

    res.status(200).json({
      message: "Matches fetched successfully",
      count: matches.length,
      matches
    });
  } catch (error) {
    console.error("MATCH ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};