import API from "../services/api";
import { useState } from "react";

export default function ReviewModal({ sessionId, onClose }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const submit = () => {
    API.post(`/reviews/${sessionId}/add`, {
  score: rating,
  feedback,
}).then(onClose);
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>Review</h3>

        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        />

        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />

        <button onClick={submit}>Submit</button>
      </div>
    </div>
  );
}
