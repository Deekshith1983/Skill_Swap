import { useEffect, useState } from "react";
import API from "../services/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [skill, setSkill] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    API.get(`/profile/${userId}`)
      .then(res => setProfile(res.data.user))
      .catch(err => console.log(err));
  }, []);

  const addSkill = () => {
    if (!skill) return;

    setProfile({
      ...profile,
      skillsOffered: [...(profile.skillsOffered || []), skill],
    });

    setSkill("");
  };

  const update = () => {
    const userId = localStorage.getItem("userId");

    API.put(`/profile/${userId}`, profile)
      .then(() => alert("Profile updated"))
      .catch(err => console.log(err));
  };

  return (
    <div className="container">
      <h2>Profile</h2>

      <input type="file" />

      <input
        placeholder="Name"
        value={profile.name || ""}
        onChange={e => setProfile({ ...profile, name: e.target.value })}
      />

      <input
        placeholder="Add skill"
        value={skill}
        onChange={e => setSkill(e.target.value)}
      />

      <button onClick={addSkill}>Add Skill</button>

      {/* SKILLS */}
      <div className="tags">
        {profile.skillsOffered?.map((s, i) => (
          <span key={i} className="tag">{s}</span>
        ))}
      </div>

      <button onClick={update}>Save</button>

      {/* 🔥 REVIEWS SECTION */}
      <h3>Reviews</h3>

      {profile.reviews?.length === 0 && <p>No reviews yet</p>}

      {profile.reviews?.map((r, i) => (
        <div key={i} className="card">
          <p>⭐ {r.score}</p>
          <p>{r.feedback}</p>
        </div>
      ))}
    </div>
  );
}
