import { useState } from "react";
import { rescheduleSession } from "../services/sessionService";
import "../styles/modals/RescheduleModal.css";

export default function RescheduleModal({ session, onClose, onSuccess }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(session?.durationMins?.toString() || "60");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!date || !time) {
      setError("Please select date and time");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Combine date and time into ISO format
      // HTML5 date input format: "2026-04-07"
      // HTML5 time input format: "14:30"
      const dateTimeStr = `${date}T${time}:00`;
      const dateTime = new Date(dateTimeStr);
      
      // Validate the date is valid
      if (isNaN(dateTime.getTime())) {
        setError("Invalid date or time selected");
        setLoading(false);
        return;
      }

      const durationMins = parseInt(duration);

      // Validate duration
      if (isNaN(durationMins) || durationMins <= 0) {
        setError("Invalid duration");
        setLoading(false);
        return;
      }

      console.log("Rescheduling with:", {
        sessionId: session._id,
        sessionExists: !!session,
        sessionStatus: session?.status,
        dateTime: dateTime.toISOString(),
        durationMins: durationMins,
        apiEndpoint: `/api/sessions/${session._id}/reschedule`
      });

      // Update session with new datetime and duration using dedicated reschedule endpoint
      await rescheduleSession(session._id, dateTime.toISOString(), durationMins);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error rescheduling session:", {
        error: err,
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.response?.data?.message,
        fullError: err.response?.data,
        url: err.config?.url,
        method: err.config?.method
      });
      setError(err.response?.data?.message || "Failed to reschedule session");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  const partner = session.userB || session.userA;
  const currentDate = session.dateTime ? new Date(session.dateTime) : null;
  const currentDateStr = currentDate
    ? currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const currentTimeStr = currentDate
    ? currentDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "N/A";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="reschedule-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Reschedule session</h2>

        {/* Current Session Info */}
        <div className="current-session">
          <p className="info-text">
            Current: <strong>{currentDateStr}</strong> at <strong>{currentTimeStr}</strong> · {session.durationMins || 60} min with{" "}
            <strong>{partner?.name}</strong>
          </p>
        </div>

        {/* Form Fields */}
        <div className="modal-form">
          <div className="form-group">
            <label>New date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>New time</label>
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

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="btn-confirm-reschedule"
          >
            {loading ? "Confirming..." : "Confirm reschedule"}
          </button>
          <button onClick={onClose} className="btn-cancel-modal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
