import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySessions } from "../services/sessionService";
import { getIncomingRequests } from "../services/requestService";
import { getComplementaryMatches } from "../services/matchService";
import { getMyProfile } from "../services/profileService";
import Spinner from "../components/common/Spinner";
import Avatar from "../components/common/Avatar";
import "../styles/pages/DashboardPage.css";

export default function DashboardPage({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [userRes, sessionsRes, requestsRes, matchesRes] = await Promise.all([
        getMyProfile(),
        getMySessions(),
        getIncomingRequests(),
        getComplementaryMatches()
      ]);

      setUser(userRes.data?.user || userRes.data);
      setSessions(sessionsRes.data?.sessions || sessionsRes.data || []);
      setRequests(requestsRes.data?.requests || []);
      setMatches(matchesRes.data?.users || []);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner fullPage />;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const totalSessions = Array.isArray(sessions) ? sessions.length : 0;
  const avgRating = user?.rating || 0;
  const requestsArray = Array.isArray(requests) ? requests : [];
  const pendingReqs = requestsArray.filter(r => r.status === "Pending").length;
  const skillsCount = (user?.skillsOffered || []).length;

  return (
    <div className="dashboard-container">
      {/* Greeting Section */}
      <div className="greeting-section">
        <div>
          <h1>Welcome, {user?.name?.split(" ")[0]}</h1>
          <p className="greeting-meta">{today} • {pendingReqs} pending request{pendingReqs !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => navigate("/search")} className="btn-find-matches">
          🔍 Find Matches
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">{totalSessions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Rating</div>
          <div className="stat-value">★ {avgRating.toFixed(1)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{pendingReqs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Skills Offered</div>
          <div className="stat-value">{skillsCount}</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="two-column-layout">
        {/* Left Column */}
        <div className="column-left">
          {/* Recent Activity */}
          <div className="card">
            <h2 className="card-title">Recent Activity</h2>
            {Array.isArray(sessions) && sessions.length > 0 ? (
              <ul className="activity-list">
                {sessions.slice(0, 4).map((s, i) => (
                  <li key={i} className="activity-item">
                    <div className="activity-left">
                      <div className="activity-badge">{s.status?.charAt(0)}</div>
                      <div>
                        <div className="activity-title">{s.skillA} ↔ {s.skillB}</div>
                        <div className="activity-meta">{s.status}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No sessions yet. Start searching!</p>
            )}
          </div>

          {/* Your Skills */}
          <div className="card">
            <h2 className="card-title">Your Skills Snapshot</h2>
            <div className="skills-section">
              <div>
                <div className="skill-label">Teaching</div>
                <div className="skills-list">
                  {(user?.skillsOffered || []).slice(0, 3).map((s, i) => (
                    <span key={i} className="skill-pill-green">{s}</span>
                  ))}
                  {(user?.skillsOffered || []).length === 0 && <p className="text-muted">Add skills to teach</p>}
                </div>
              </div>
              <div>
                <div className="skill-label">Learning</div>
                <div className="skills-list">
                  {(user?.skillsNeeded || []).slice(0, 3).map((s, i) => (
                    <span key={i} className="skill-pill-blue">{s}</span>
                  ))}
                  {(user?.skillsNeeded || []).length === 0 && <p className="text-muted">Add skills to learn</p>}
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/profile/me")} className="btn-update-skills">
              Update Your Skills
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="column-right">
          {/* Pending Requests */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Pending Requests</h2>
              <span className="badge-count">{pendingReqs} NEW</span>
            </div>
            {requestsArray.filter(r => r.status === "Pending").length > 0 ? (
              <ul className="requests-list">
                {requestsArray.filter(r => r.status === "Pending").slice(0, 3).map((r, i) => (
                  <li key={i} className="request-item">
                    <Avatar name={r.userA?.name} size="sm" />
                    <div className="request-info">
                      <div className="request-name">{r.userA?.name}</div>
                      <div className="request-skills">Offers {r.skillA} • Wants {r.skillB}</div>
                    </div>
                    <div className="request-actions">
                      <button
                        onClick={() => navigate("/requests")}
                        className="btn-accept"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => navigate("/requests")}
                        className="btn-decline"
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No pending requests</p>
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="card">
            <h2 className="card-title">Upcoming Sessions</h2>
            {Array.isArray(sessions) && sessions.filter(s => s.status === "Scheduled").length > 0 ? (
              <ul className="sessions-list">
                {sessions
                  .filter(s => s.status === "Scheduled")
                  .slice(0, 2)
                  .map((s, i) => (
                    <li key={i} className="session-item">
                      <Avatar name={s.userB?.name} size="sm" />
                      <div className="session-info">
                        <div className="session-name">{s.userB?.name}</div>
                        <div className="session-skills">{s.skillA} ↔ {s.skillB}</div>
                        <div className="session-time">{new Date(s.dateTime).toLocaleDateString()} • {new Date(s.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                      <span className="badge-scheduled">Scheduled</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="empty-state">No scheduled sessions</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Matches */}
      {Array.isArray(matches) && matches.length > 0 && (
        <div className="card">
          <h2 className="card-title">Recommended Matches</h2>
          <div className="matches-grid">
            {matches.slice(0, 3).map((matchUser, i) => (
              <div key={i} className="match-card">
                <Avatar name={matchUser.name} size="lg" />
                <h3>{matchUser.name}</h3>
                <p className="match-college">{matchUser.college}</p>
                <div className="match-rating">★ {matchUser.rating} ({matchUser.sessionHistory?.length || 0} sessions)</div>
                <button onClick={() => navigate("/search")} className="btn-connect">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

