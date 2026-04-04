import { useState } from "react";
import API from "../services/api";

export default function ScheduleModal({ session, onClose }) {
  const [time, setTime] = useState("");

  const submit = () => {
    API.patch(`/sessions/${session._id}/status`, {
  status: "Scheduled",
  dateTime: time
})
      .then(onClose)
      .catch(err => console.log(err));
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>Schedule</h3>

        <input
          type="datetime-local"
          value={time}
          onChange={e => setTime(e.target.value)}
        />

        <button onClick={submit}>Confirm</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
