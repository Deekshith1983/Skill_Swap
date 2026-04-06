const User = require("../Models/User");

// GET /api/search?q=&experience=&minRating=&sort=
exports.searchUsers = async (req, res) => {
  try {
    const { q, experience, minRating, sort, page = 1, limit = 12 } = req.query;
    const currentUserId = req.user._id;

    // Build base filter
    let filter = { _id: { $ne: currentUserId } };

    // Add experience filter
    if (experience) {
      filter.experienceLevel = experience;
    }

    // Add rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    let mode = 'search';
    let users = [];

    if (q) {
      // Mode A: Keyword search
      filter.$or = [
        { skillsOffered: { $regex: q, $options: 'i' } },
        { skillsNeeded: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
        { college: { $regex: q, $options: 'i' } }
      ];

      users = await User.find(filter).select('-password');
      mode = 'search';

      // Sort search results
      if (sort === 'rating') {
        users.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'sessions') {
        users.sort((a, b) => (b.sessionHistory?.length || 0) - (a.sessionHistory?.length || 0));
      } else {
        // Default: sort by relevance (matching skills)
        users.sort((a, b) => {
          const aMatches = (a.skillsOffered || []).filter(s => s.toLowerCase().includes(q.toLowerCase())).length +
                          (a.skillsNeeded || []).filter(s => s.toLowerCase().includes(q.toLowerCase())).length;
          const bMatches = (b.skillsOffered || []).filter(s => s.toLowerCase().includes(q.toLowerCase())).length +
                          (b.skillsNeeded || []).filter(s => s.toLowerCase().includes(q.toLowerCase())).length;
          return bMatches - aMatches;
        });
      }
    } else {
      // Mode B: Complementary match
      const currentUser = await User.findById(currentUserId).select('-password');
      if (!currentUser) {
        return res.status(404).json({ message: "Current user not found" });
      }

      const mySkillsOffered = currentUser.skillsOffered || [];
      const mySkillsNeeded = currentUser.skillsNeeded || [];

      filter.skillsOffered = { $in: mySkillsNeeded };
      filter.skillsNeeded = { $in: mySkillsOffered };

      users = await User.find(filter).select('-password');
      mode = 'match';

      // Compute overlap score and sort
      users = users.map(user => ({
        ...user.toObject(),
        matchScore: (user.skillsOffered?.filter(s => mySkillsNeeded.some(n => n.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(n.toLowerCase()))).length || 0) +
                   (user.skillsNeeded?.filter(s => mySkillsOffered.some(o => o.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(o.toLowerCase()))).length || 0)
      })).sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        return (b.rating || 0) - (a.rating || 0);
      });
    }

    // Compute match info for all results
    const currentUser = await User.findById(currentUserId).select('-password');
    const finalUsers = users.map(user => {
      const offeredMatch = (user.skillsOffered || []).filter(s =>
        (currentUser.skillsNeeded || []).some(n => n.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(n.toLowerCase()))
      );
      const neededMatch = (user.skillsNeeded || []).filter(s =>
        (currentUser.skillsOffered || []).some(o => o.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(o.toLowerCase()))
      );

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
        matchScore: offeredMatch.length + neededMatch.length
      };
    });

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedUsers = finalUsers.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      users: paginatedUsers,
      total: finalUsers.length,
      page: parseInt(page),
      limit: parseInt(limit),
      mode
    });
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/search/suggestions?q=
exports.getSkillSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 1) {
      return res.status(200).json([]);
    }

    const suggestions = await User.aggregate([
      { $project: { skills: { $concatArrays: ['$skillsOffered', '$skillsNeeded'] } } },
      { $unwind: '$skills' },
      { $match: { skills: { $regex: q, $options: 'i' } } },
      { $group: { _id: { $toLower: '$skills' }, display: { $first: '$skills' } } },
      { $sort: { _id: 1 } },
      { $limit: 8 },
      { $project: { _id: 0, skill: '$display' } }
    ]);

    res.status(200).json(suggestions.map(s => s.skill));
  } catch (error) {
    console.error("SUGGESTIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
