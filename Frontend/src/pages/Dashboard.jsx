import { useEffect, useState } from "react";
import API from "../services/authService";
import useAuth from "../useAuth";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/sessions/mine");
        setSessions(res.data);
      } catch {
        // fallback dummy data
        setSessions([
          { status: "Pending" },
          { status: "Completed" }
        ]);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <button
        onClick={() => {
          logout();
          window.location.href = "/";
        }}
      >
        Logout
      </button>

      <h3>Total Sessions: {sessions.length}</h3>

      {sessions.map((s, i) => (
        <div key={i}>
          <p>Status: {s.status}</p>
        </div>
      ))}
    </div>
  );
}