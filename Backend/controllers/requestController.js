const Session = require("../Models/Session");

// ================= SEND REQUEST =================
exports.sendRequest = async (req, res) => {
  try {
    const userA = req.user.id; // sender
    const { userB, skillA, skillB, note } = req.body;

    const session = await Session.create({
      userA,
      userB,
      skillA,
      skillB,
      note,
      status: "Pending"
    });

    res.status(201).json({
      message: "Request sent successfully",
      session
    });
  } catch (error) {
    console.error("SEND REQUEST ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= ACCEPT REQUEST =================
exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByIdAndUpdate(
      id,
      { status: "Scheduled" },
      { new: true }
    );

    res.status(200).json({
      message: "Request accepted",
      session
    });
  } catch (error) {
    console.error("ACCEPT ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= REJECT REQUEST =================
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true }
    );

    res.status(200).json({
      message: "Request rejected",
      session
    });
  } catch (error) {
    console.error("REJECT ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= INCOMING REQUESTS =================
exports.getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await Session.find({
      userB: userId,
      status: "Pending"
    }).populate("userA", "name email");

    res.status(200).json({
      message: "Incoming requests fetched",
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error("INCOMING ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};