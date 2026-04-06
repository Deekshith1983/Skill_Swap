import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIncomingRequests, getSentRequests, acceptRequest, rejectRequest } from "../services/requestService";
import Avatar from "../components/common/Avatar";
import SkillPill from "../components/common/SkillPill";
import Spinner from "../components/common/Spinner";
import ScheduleModal from "../components/ScheduleModal";
import { Link } from "react-router-dom";
import "../styles/pages/RequestsPage.css";

export default function RequestsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("incoming");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    loadRequests();
  }, [tab]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = tab === "incoming" ? await getIncomingRequests() : await getSentRequests();
      setRequests(res.data.requests || []);
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId, request) => {
    try {
      await acceptRequest(requestId);
      setRequests(requests.filter(r => r._id !== requestId));
      
      // Store the request and open ScheduleModal
      setSelectedRequest(request);
      setShowScheduleModal(true);
    } catch (error) {
      alert("Failed to accept request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId);
      setRequests(requests.filter(r => r._id !== requestId));
      alert("Request rejected!");
    } catch (error) {
      alert("Failed to reject request");
    }
  };

  if (loading) return <Spinner fullPage />;

  return (
    <div className="requests-page-container">
      {/* Tabs */}
      <div className="requests-tabs">
        <button
          onClick={() => setTab("incoming")}
          className={`tab ${tab === "incoming" ? "tab-active" : ""}`}
        >
          Incoming
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`tab ${tab === "sent" ? "tab-active" : ""}`}
        >
          Sent
        </button>
      </div>

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="empty-state">
          <p>No {tab} requests</p>
        </div>
      )}

      {/* Requests List */}
      <div className="requests-list">
        {requests.map((req) => {
          const partner = tab === "incoming" ? req.userA : req.userB;
          return (
            <div key={req._id} className="request-card">
              <div className="card-header">
                <Link to={`/profile/${partner._id}`} className="profile-link">
                  <div className="partner-info">
                    <Avatar name={partner.name} size="sm" />
                    <div>
                      <h3 className="partner-name">{partner.name}</h3>
                      <p className="partner-college">{partner.college}</p>
                    </div>
                  </div>
                </Link>
                <div className="swap-info">
                  <SkillPill skill={req.skillA} variant="offered" />
                  <span className="arrow">↔</span>
                  <SkillPill skill={req.skillB} variant="needed" />
                </div>
              </div>

              {/* Actions - Only for incoming */}
              {tab === "incoming" && (
                <div className="actions">
                  <button
                    onClick={() => handleAccept(req._id, req)}
                    className="btn-accept"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    className="btn-reject"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Status badge for sent */}
              {tab === "sent" && (
                <div className="status-badge">
                  {req.status === "Pending" ? "Pending..." : req.status}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Modal - Opens after accepting a request */}
      {showScheduleModal && selectedRequest && (
        <ScheduleModal
          partner={selectedRequest.userA}
          sessionId={selectedRequest._id}
          partnerUserId={selectedRequest.userA._id}
          skillA={selectedRequest.skillA}
          skillB={selectedRequest.skillB}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedRequest(null);
          }}
          onSuccess={() => {
            setShowScheduleModal(false);
            setSelectedRequest(null);
            // Navigate to schedule page after successful scheduling
            navigate("/schedule");
          }}
        />
      )}
    </div>
  );
}
