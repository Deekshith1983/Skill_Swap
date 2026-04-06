const Session = require("../Models/Session");

// POST /api/requests/send - Send connection request
exports.sendRequest = async (req, res) => {
  try {
    const userA = req.user._id;
    const { toUserId, skillOffered, skillNeeded } = req.body;

    if (!toUserId || !skillOffered || !skillNeeded) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if request already exists
    const existing = await Session.findOne({
      $or: [
        { userA, userB: toUserId, status: 'Pending' },
        { userA: toUserId, userB: userA, status: 'Pending' }
      ]
    });

    if (existing) {
      return res.status(409).json({ message: "Request already exists" });
    }

    const session = await Session.create({
      userA,
      userB: toUserId,
      skillA: skillOffered,
      skillB: skillNeeded,
      status: "Pending"
    });

    res.status(201).json({
      message: "Request sent successfully",
      session
    });
  } catch (error) {
    console.error("SEND REQUEST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/requests/incoming - Get incoming requests
exports.getIncomingRequests = async (req, res) => {
  try {
    const sessions = await Session.find({
      userB: req.user._id,
      status: 'Pending'
    })
      .populate('userA', 'name email profilePic college experienceLevel rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Incoming requests fetched",
      requests: sessions
    });
  } catch (error) {
    console.error("GET INCOMING ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/requests/sent - Get sent requests
exports.getSentRequests = async (req, res) => {
  try {
    const sessions = await Session.find({
      userA: req.user._id,
      status: 'Pending'
    })
      .populate('userB', 'name email profilePic college experienceLevel rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Sent requests fetched",
      requests: sessions
    });
  } catch (error) {
    console.error("GET SENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/requests/:id/accept - Accept request
exports.acceptRequest = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: "Accepted" },
      { new: true }
    ).populate('userA userB', '-password');

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({
      message: "Request accepted",
      session
    });
  } catch (error) {
    console.error("ACCEPT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/requests/:id/reject - Reject request
exports.rejectRequest = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({
      message: "Request rejected",
      session
    });
  } catch (error) {
    console.error("REJECT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/requests/accepted/:userId - Check if request is accepted with specific user
exports.getAcceptedRequest = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    // Find an accepted request (status: Accepted or Scheduled) between the two users
    const request = await Session.findOne({
      $or: [
        { userA: currentUserId, userB: userId, status: { $in: ['Accepted', 'Scheduled'] } },
        { userA: userId, userB: currentUserId, status: { $in: ['Accepted', 'Scheduled'] } }
      ]
    }).populate('userA userB', '-password');

    if (!request) {
      return res.status(200).json({
        message: "No accepted request found",
        request: null,
        status: null
      });
    }

    res.status(200).json({
      message: "Accepted request found",
      request,
      status: request.status
    });
  } catch (error) {
    console.error("GET ACCEPTED REQUEST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};