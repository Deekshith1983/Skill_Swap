import { useState } from "react";
import { submitReview } from "../services/sessionService";
import Avatar from "./common/Avatar";
import "../styles/modals/ReviewModal.css";

export default function ReviewModal({ session, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await submitReview(session._id, rating, feedback);
      setSubmitted(true);
      
      // Show success message for 2 seconds then close
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.userB && !session?.userA) return null;

  const partner = session.userB || session.userA;
  const teachingSkill = session.skillA;
  const learningSkill = session.skillB;
  const sessionDate = session.dateTime ? new Date(session.dateTime) : null;
  const dateStr = sessionDate
    ? sessionDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "N/A";
  const timeStr = sessionDate
    ? sessionDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "N/A";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className="review-success">
            <div className="success-icon">✓</div>
            <h2>Review Submitted!</h2>
            <p>Thank you for rating your session</p>
          </div>
        ) : (
          <>
            <h2>Rate your session</h2>

            {/* Session Info */}
            <div className="review-session-info">
              <Avatar name={partner?.name} size="md" />
              <div>
                <p className="session-partner">{partner?.name}</p>
                <p className="session-skills">{teachingSkill} ↔ {learningSkill}</p>
                <p className="session-time">{dateStr} • {timeStr}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="review-section">
              <label className="review-label">Your rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`star ${
                      star <= (hoverRating || rating) ? "active" : ""
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="rating-text">{rating} out of 5 stars</p>
            </div>

            {/* Feedback */}
            <div className="review-section">
              <label className="review-label">Written feedback (optional)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with this skill swap..."
                className="review-textarea"
                rows="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Actions */}
            <div className="review-actions">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-submit-review"
              >
                {loading ? "Submitting..." : "Submit review"}
              </button>
              <button onClick={onClose} className="btn-skip-review">
                Skip for now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
