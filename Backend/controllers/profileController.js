const User = require("../Models/User");

// GET /api/profile/me - Get current user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('sessionHistory')
      .populate('reviews.reviewer', 'name profilePic');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("GetMyProfile ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/profile/:id - Get user profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('sessionHistory')
      .populate('reviews.reviewer', 'name profilePic');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("GetProfileById ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/profile/:id - Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { bio, skillsOffered, skillsNeeded, experienceLevel, mobile, email } = req.body;

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (skillsOffered) updateData.skillsOffered = skillsOffered;
    if (skillsNeeded) updateData.skillsNeeded = skillsNeeded;
    if (experienceLevel) updateData.experienceLevel = experienceLevel;
    if (mobile) updateData.mobile = mobile;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error("UpdateProfile ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/profile/me/picture - Upload profile picture
exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: "Profile picture updated", user });
  } catch (error) {
    console.error("UploadProfilePic ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};