import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySessions, updateSessionStatus, submitReview } from "../services/sessionService";
import { getMyProfile } from "../services/profileService";
import Avatar from "../components/common/Avatar";
import Spinner from "../components/common/Spinner";
import ScheduleModal from "../components/ScheduleModal";
import RescheduleModal from "../components/RescheduleModal";
import ReviewModal from "../components/ReviewModal";
import "../styles/pages/SchedulePage.css";

export default function SchedulePage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Scheduled");
  
  // Modal states
  const [scheduleModal, setScheduleModal] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Get current user ID
      const userRes = await getMyProfile();
      setCurrentUserId(userRes.data._id);
      
      // Load sessions
      const sessionsRes = await getMySessions();
      setSessions(Array.isArray(sessionsRes.data?.sessions) ? sessionsRes.data.sessions : []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = Array.isArray(sessions) ? sessions.filter(s => s.status === tab) : [];

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      await updateSessionStatus(sessionId, newStatus);
      setSessions(sessions.map(s =>
        s._id === sessionId ? { ...s, status: newStatus } : s
      ));
    } catch (error) {
      alert("Failed to update session status");
    }
  };

  if (loading || !currentUserId) return <Spinner fullPage />;

  return (
    <div className="schedule-page-container">
      <div className="schedule-header">
        <h1>My schedule</h1>
      </div>

      {/* Tabs */}
      <div className="schedule-tabs">
        {["Pending", "Scheduled", "Ongoing", "Completed", "Cancelled"].map((status) => {
          const count = sessions.filter(s => s.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setTab(status)}
              className={`schedule-tab ${tab === status ? "schedule-tab-active" : ""}`}
            >
              {status}
              {count > 0 && <span className="tab-badge">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Sessions List */}
      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No {tab.toLowerCase()} sessions</p>
        </div>
      )}

      <div className="sessions-list">
        {filtered.map((session) => {
          // Safety checks for userA and userB
          if (!session?.userA || !session?.userB) {
            return null; // Skip sessions with missing user data
          }

          const isUserA = session.userA._id === currentUserId;
          const partner = isUserA ? session.userB : session.userA;
          const teachingSkill = isUserA ? session.skillA : session.skillB;
          const learningSkill = isUserA ? session.skillB : session.skillA;

          if (!partner) {
            return null; // Skip if partner is null
          }

          const sessionDate = session.dateTime ? new Date(session.dateTime) : null;
          const dateStr = sessionDate ? sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A";
          const timeStr = sessionDate ? sessionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : "N/A";

          return (
            <div key={session._id} className="session-card">
              {/* Session Header */}
              <div className="session-header">
                <div className="partner-section">
                  <Avatar name={partner.name} size="sm" />
                  <div className="partner-info">
                    <h3>{partner.name}</h3>
                    <p className="skill-swap">{teachingSkill} ↔ {learningSkill} swap</p>
                  </div>
                </div>
                <span className="scheduled-badge">Scheduled</span>
              </div>

              {/* Session Details */}
              <div className="session-details">
                <div className="detail-item">
                  <label>Date</label>
                  <p>{dateStr}</p>
                </div>
                <div className="detail-item">
                  <label>Time</label>
                  <p>{timeStr}</p>
                </div>
                <div className="detail-item">
                  <label>Duration</label>
                  <p>{session.durationMins || 60} min</p>
                </div>
              </div>

              {/* Session Actions */}
              <div className="session-actions">
                {tab === "Scheduled" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(session._id, "Ongoing")}
                      className="btn-action btn-mark-ongoing"
                    >
                      Mark ongoing
                    </button>
                    <button
                      onClick={() => setRescheduleModal(session)}
                      className="btn-action btn-reschedule"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleStatusChange(session._id, "Cancelled")}
                      className="btn-action btn-cancel"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {tab === "Pending" && (
                  <>
                    <button
                      onClick={() => setScheduleModal(session)}
                      className="btn-action btn-accept"
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => handleStatusChange(session._id, "Cancelled")}
                      className="btn-action btn-cancel"
                    >
                      Decline
                    </button>
                  </>
                )}

                {tab === "Ongoing" && (
                  <button
                    onClick={() => handleStatusChange(session._id, "Completed")}
                    className="btn-action btn-complete"
                  >
                    Mark Complete
                  </button>
                )}

                {tab === "Completed" && (
                  <>
                    {session.ratings?.some(r => r.from === currentUserId) ? (
                      <button
                        disabled
                        className="btn-action btn-review btn-submitted"
                      >
                        ✓ Submitted
                      </button>
                    ) : (
                      <button
                        onClick={() => setReviewModal(session)}
                        className="btn-action btn-review"
                      >
                        Write Review
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Modal - for Pending sessions */}
      {scheduleModal && (
        <ScheduleModal
          partner={
            scheduleModal.userA?._id === currentUserId
              ? scheduleModal.userB
              : scheduleModal.userA
          }
          partnerUserId={
            scheduleModal.userA?._id === currentUserId
              ? scheduleModal.userB?._id
              : scheduleModal.userA?._id
          }
          sessionId={scheduleModal._id}
          onClose={() => setScheduleModal(null)}
          onSuccess={() => {
            loadInitialData();
            setScheduleModal(null);
          }}
        />
      )}

      {/* Reschedule Modal - for Scheduled sessions */}
      {rescheduleModal && (
        <RescheduleModal
          session={rescheduleModal}
          onClose={() => setRescheduleModal(null)}
          onSuccess={() => {
            loadInitialData();
            setRescheduleModal(null);
          }}
        />
      )}

      {/* Review Modal - for Completed sessions */}
      {reviewModal && (
        <ReviewModal
          session={reviewModal}
          onClose={() => setReviewModal(null)}
          onSuccess={() => {
            loadInitialData();
            setReviewModal(null);
          }}
        />
      )}
    </div>
  );
}
