import { useState, useEffect } from "react";
import { createSession } from "../services/sessionService";
import { getAcceptedRequest } from "../services/requestService";
import Avatar from "./common/Avatar";
import "../styles/modals/ScheduleModal.css";

export default function ScheduleModal({ partner, sessionId, partnerUserId, skillA, skillB, onClose, onSuccess }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestStatus, setRequestStatus] = useState("Accepted"); // Assume Accepted when opening from RequestsPage
  const [checkingRequest, setCheckingRequest] = useState(false);

  useEffect(() => {
    // If skillA and skillB are provided, we don't need to check status
    if (skillA && skillB) {
      setCheckingRequest(false);
      setRequestStatus("Accepted");
    } else {
      checkRequestStatus();
    }
  }, [partnerUserId, skillA, skillB]);

  const checkRequestStatus = async () => {
    try {
      setCheckingRequest(true);
      if (partnerUserId) {
        const res = await getAcceptedRequest(partnerUserId);
        setRequestStatus(res.data?.request?.status || null);
      }
    } catch (err) {
      console.error("Error checking request status:", err);
      setRequestStatus(null);
    } finally {
      setCheckingRequest(false);
    }
  };

  const handleConfirm = async () => {
    if (!date || !time) {
      setError("Please select date and time");
      return;
    }

    // Check if request is accepted before scheduling
    if (requestStatus !== "Accepted") {
      setError("You must accept the request from this user before scheduling a session");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Combine date and time
      const dateTimeStr = `${date}T${time}`;
      const dateTime = new Date(dateTimeStr);

      await createSession(sessionId, dateTime.toISOString(), parseInt(duration), note);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error scheduling session:", err);
      setError(err.response?.data?.message || "Failed to schedule session");
    } finally {
      setLoading(false);
    }
  };

  if (checkingRequest) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
          <p style={{ textAlign: "center" }}>Checking request status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Schedule a session</h2>

        {/* Request Status Alert */}
        {requestStatus !== "Accepted" && (
          <div className="status-alert alert-warning">
            ⚠️ You need to accept the request from {partner?.name} before scheduling a session.
          </div>
        )}

        {/* Partner Info */}
        <div className="modal-partner">
          <Avatar name={partner?.name} size="md" />
          <div>
            <p className="partner-name">{partner?.name}</p>
            <p className="partner-skill">{skillB || "Skill"} ↔ {skillA || "Skill"} swap</p>
          </div>
        </div>

        {/* Form Fields - Disabled if request not accepted */}
        {requestStatus === "Accepted" ? (
          <div className="modal-form">
            <div className="form-group">
              <label>Select date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-input"
                >
                  <option value="30">30 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                  <option value="120">120 min</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Note to partner (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Let's cover hooks and context first, then move to state management."
                className="form-textarea"
                rows="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
            <p>Please accept the request first to schedule a session</p>
          </div>
        )}

        {/* Actions */}
        <div className="modal-actions">
          <button
            onClick={handleConfirm}
            disabled={loading || requestStatus !== "Accepted"}
            className="btn-confirm"
          >
            {loading ? "Confirming..." : requestStatus === "Accepted" ? "Confirm session" : "Accept request first"}
          </button>
          <button onClick={onClose} className="btn-cancel-modal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
