import { useEffect, useState } from "react";
import API from "../services/api";
import ScheduleModal from "../components/ScheduleModal";
import ReviewModal from "../components/ReviewModal";

export default function SchedulePage() {
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState("Scheduled");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get("/sessions/mine").then(res => setSessions(res.data));
  }, []);

  const filtered = sessions.filter(s => s.status === tab);

  return (
    <div className="container">
      <h2>Schedule</h2>

      <div className="tabs">
        {["Pending","Scheduled","Ongoing","Completed","Cancelled"].map(t => (
          <button key={t} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {filtered.map(s => (
        <div className="card" key={s._id}>
          {s.userA?.name} & {s.userB?.name}
          {tab === "Scheduled" && (
            <button onClick={() => setSelected(s)}>Reschedule</button>
          )}

          {tab === "Completed" && (
            <button onClick={() => setSelected(s)}>Review</button>
          )}
        </div>
      ))}

      {selected && tab === "Scheduled" && (
        <ScheduleModal session={selected} onClose={() => setSelected(null)} />
      )}

      {selected && tab === "Completed" && (
        <ReviewModal sessionId={selected._id} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
