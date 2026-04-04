const Session = require("../Models/Session");

//  GET MY SESSIONS
exports.getMySessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await Session.find({
      $or: [
        { userA: userId },
        { userB: userId }
      ]
    }).populate("userA userB", "name email rating");

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET SINGLE SESSION
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("userA userB", "name email rating");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS
exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    //  VALID TRANSITIONS
    const allowedTransitions = {
      Pending: ["Scheduled", "Cancelled"],
      Scheduled: ["Ongoing", "Cancelled"],
      Ongoing: ["Completed"],
      Completed: [],
      Cancelled: [],
    };

    if (!allowedTransitions[session.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change from ${session.status} to ${status}`,
      });
    }

    session.status = status;
    await session.save();

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};