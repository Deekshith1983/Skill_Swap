const Session = require("../Models/Session");
const User = require("../Models/User");

// POST /api/sessions/create - Create a scheduled session
exports.createSession = async (req, res) => {
  try {
    const { sessionId, dateTime, durationMins, note } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== 'Pending' && session.status !== 'Scheduled') {
      return res.status(400).json({ message: "Cannot schedule this session" });
    }

    session.dateTime = new Date(dateTime);
    session.durationMins = durationMins || 60;
    session.note = note || '';
    session.status = 'Scheduled';

    await session.save();

    res.status(200).json({
      message: "Session scheduled successfully",
      session
    });
  } catch (error) {
    console.error("CREATE SESSION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/sessions/mine - Get all sessions for current user
exports.getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      $or: [
        { userA: userId },
        { userB: userId }
      ]
    })
      .populate('userA userB', '-password')
      .sort({ dateTime: -1 });

    res.status(200).json({
      message: "Sessions fetched successfully",
      sessions
    });
  } catch (error) {
    console.error("GET MY SESSIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/sessions/:id - Get single session
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('userA userB', '-password');

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error("GET SESSION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/sessions/:id/status - Update session status (includes reschedule support)
exports.updateSessionStatus = async (req, res) => {
  try {
    const { status, dateTime, durationMins } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Valid transitions
    const allowedTransitions = {
      'Pending': ['Accepted', 'Cancelled'],
      'Accepted': ['Scheduled', 'Cancelled'],
      'Scheduled': ['Ongoing', 'Cancelled', 'Scheduled'], // Allow Scheduled -> Scheduled for reschedule
      'Ongoing': ['Completed'],
      'Completed': [],
      'Cancelled': []
    };

    // Check if transition is allowed
    if (!allowedTransitions[session.status]?.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${session.status} to ${status}`,
        currentStatus: session.status,
        requestedStatus: status
      });
    }

    session.status = status;

    // Handle rescheduling - update dateTime and duration if provided
    if (dateTime) {
      const parsedDate = new Date(dateTime);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid dateTime format" });
      }
      session.dateTime = parsedDate;
    }
    
    if (durationMins !== undefined && durationMins !== null) {
      const parsedDuration = parseInt(durationMins);
      if (isNaN(parsedDuration) || parsedDuration <= 0) {
        return res.status(400).json({ message: "Invalid duration - must be a positive number" });
      }
      session.durationMins = parsedDuration;
    }

    // Add to session history when completed
    if (status === 'Completed') {
      await User.findByIdAndUpdate(session.userA, {
        $push: { sessionHistory: session._id }
      });
      await User.findByIdAndUpdate(session.userB, {
        $push: { sessionHistory: session._id }
      });
    }

    await session.save();

    res.status(200).json({
      message: "Session status updated",
      session
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PATCH /api/sessions/:id/reschedule - Reschedule a session (allows unlimited reschedules)
exports.rescheduleSession = async (req, res) => {
  try {
    const { dateTime, durationMins } = req.body;

    // Validate required fields
    if (!dateTime) {
      return res.status(400).json({ message: "dateTime is required" });
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Only allow rescheduling of "Scheduled" sessions
    if (session.status !== 'Scheduled') {
      return res.status(400).json({ 
        message: `Cannot reschedule a ${session.status} session. Only 'Scheduled' sessions can be rescheduled.`,
        currentStatus: session.status
      });
    }

    // Validate and update dateTime
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid dateTime format" });
    }
    session.dateTime = parsedDate;

    // Update duration if provided
    if (durationMins !== undefined && durationMins !== null) {
      const parsedDuration = parseInt(durationMins);
      if (isNaN(parsedDuration) || parsedDuration <= 0) {
        return res.status(400).json({ message: "Invalid duration - must be a positive number" });
      }
      session.durationMins = parsedDuration;
    }

    await session.save();

    res.status(200).json({
      message: "Session rescheduled successfully",
      session
    });
  } catch (error) {
    console.error("RESCHEDULE SESSION ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/sessions/:id/review - Submit review
exports.submitReview = async (req, res) => {
  try {
    const { score, feedback } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== 'Completed') {
      return res.status(400).json({ message: "Can only review completed sessions" });
    }

    // Check if already reviewed
    if (session.ratings?.some(r => r.from.toString() === req.user._id.toString())) {
      return res.status(409).json({ message: "You have already reviewed this session" });
    }

    // Determine reviewee
    const revieweeId = session.userA.toString() === req.user._id.toString() ? session.userB : session.userA;

    // Add rating to session
    session.ratings.push({
      from: req.user._id,
      score: parseInt(score),
      feedback: feedback || ''
    });

    await session.save();

    // Update reviewee's reviews
    const reviewee = await User.findById(revieweeId);
    reviewee.reviews.push({
      reviewer: req.user._id,
      session: session._id,
      score: parseInt(score),
      feedback: feedback || ''
    });

    // Recalculate rating
    if (reviewee.reviews.length > 0) {
      const avgRating = reviewee.reviews.reduce((sum, r) => sum + r.score, 0) / reviewee.reviews.length;
      reviewee.rating = Math.round(avgRating * 10) / 10;
    }

    await reviewee.save();

    res.status(200).json({
      message: "Review submitted successfully",
      session
    });
  } catch (error) {
    console.error("SUBMIT REVIEW ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};