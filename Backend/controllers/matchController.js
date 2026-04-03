const User = require("../Models/User");

// ==================================================
// 1. AUTO MATCH - based on logged-in user's profile
// GET /match
// ==================================================
exports.getMatches = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId).select("-password");

    if (!currentUser) {
      return res.status(404).json({ msg: "Current user not found" });
    }

    const mySkillsOffered = currentUser.skillsOffered || [];
    const mySkillsNeeded = currentUser.skillsNeeded || [];

    const otherUsers = await User.find({
      _id: { $ne: currentUserId }
    }).select("-password");

    const matches = otherUsers
      .map((user) => {
        const theirSkillsOffered = user.skillsOffered || [];
        const theirSkillsNeeded = user.skillsNeeded || [];

        const offeredMatch = mySkillsNeeded.filter((skill) =>
          theirSkillsOffered.includes(skill)
        );

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

// ==================================================
// 2. SEARCH-BASED MATCH - based on skill from search bar
// GET /match/search?skill=MongoDB
// ==================================================
exports.searchMatches = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { skill } = req.query;

    if (!skill) {
      return res.status(400).json({ msg: "Skill query is required" });
    }

    const currentUser = await User.findById(currentUserId).select("-password");

    if (!currentUser) {
      return res.status(404).json({ msg: "Current user not found" });
    }

    const mySkillsOffered = currentUser.skillsOffered || [];

    const otherUsers = await User.find({
      _id: { $ne: currentUserId },
      skillsOffered: skill
    }).select("-password");

    const matches = otherUsers
      .map((user) => {
        const theirSkillsNeeded = user.skillsNeeded || [];

        const mutualSkills = mySkillsOffered.filter((mySkill) =>
          theirSkillsNeeded.includes(mySkill)
        );

        return {
          user,
          searchedSkill: skill,
          mutualSkills,
          matchScore: mutualSkills.length,
          rating: user.rating || 0
        };
      })
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return (b.rating || 0) - (a.rating || 0);
      });

    res.status(200).json({
      message: "Search matches fetched successfully",
      count: matches.length,
      matches
    });
  } catch (error) {
    console.error("SEARCH MATCH ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};