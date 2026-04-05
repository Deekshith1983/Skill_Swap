import API from "../services/api";

export default function UserCard({ user }) {
 const sendRequest = () => {
  API.post("/requests/send", {
    userB: user._id,
    skillA: user.skillsOffered?.[0] || "General",
    skillB: "General",
    note: "Let's connect"
  })
    .then(() => alert("Request Sent"))
    .catch(err => alert("Error sending request"));
};

  return (
    <div className="card">
      <h3>{user.name}</h3>

      <span className="badge">{user.experienceLevel}</span>

      <p>⭐ {user.rating || 0}</p>

      <div className="tags">
        {user.skillsOffered?.map((s, i) => (
          <span key={i} className="tag">{s}</span>
        ))}
      </div>

     <button onClick={sendRequest}>Connect</button>

<button onClick={() => alert(JSON.stringify(user, null, 2))}>
  View Profile
</button>
    </div>
  );
}
