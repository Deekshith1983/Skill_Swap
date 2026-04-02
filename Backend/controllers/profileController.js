const User = require("../Models/User");

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "mobile",
      "college",
      "profilePic",
      "bio",
      "skillsOffered",
      "skillsNeeded",
      "experienceLevel"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};