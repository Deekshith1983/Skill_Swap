import { useEffect, useState } from "react";
import API from "../services/api";

export default function RequestsPage() {
  const [tab, setTab] = useState("incoming");
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get(`/requests/${tab}`).then(res => setData(res.data.requests));
  }, [tab]);

  const action = (id, type) => {
    API.put(`/requests/${id}/${type}`).then(() => window.location.reload());
  };

  return (
    <div className="container">
      <h2>Requests</h2>

      <div className="tabs">
        <button onClick={() => setTab("incoming")}>Incoming</button>
        <button onClick={() => setTab("sent")}>Sent</button>
      </div>

      {data.map(r => (
        <div className="card" key={r._id}>
          <p>{r.userA?.name}</p>
<p>{r.skillA} → {r.skillB}</p>
          {tab === "incoming" && (
            <>
              <button onClick={() => action(r._id, "accept")}>Accept</button>
              <button onClick={() => action(r._id, "reject")}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
