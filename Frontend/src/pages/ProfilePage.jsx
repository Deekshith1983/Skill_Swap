import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfileById, getMyProfile, updateProfile } from "../services/profileService";
import { sendRequest } from "../services/requestService";
import Spinner from "../components/common/Spinner";
import Avatar from "../components/common/Avatar";
import SkillPill from "../components/common/SkillPill";
import "../styles/pages/ProfilePage.css";

export default function ProfilePage() {
  const { id } = useParams();
  const isOwnProfile = !id || id === "me";
  const [profile, setProfile] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    mobile: "",
    email: "",
    bio: "",
    skillsOffered: [],
    skillsNeeded: [],
    experienceLevel: "Beginner"
  });

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const res = isOwnProfile ? await getMyProfile() : await getProfileById(id);
      setProfile(res.data);
      setEditData({
        mobile: res.data.mobile || "",
        email: res.data.email || "",
        bio: res.data.bio || "",
        skillsOffered: res.data.skillsOffered || [],
        skillsNeeded: res.data.skillsNeeded || [],
        experienceLevel: res.data.experienceLevel || "Beginner"
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profile._id, editData);
      setProfile({ ...profile, ...editData });
      setIsEdit(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleSendRequest = async () => {
    try {
      const skillToOffer = profile.skillsNeeded[0] || "General";
      const skillToLearn = profile.skillsOffered[0] || "General";
      await sendRequest(profile._id, skillToLearn, skillToOffer);
      alert("Request sent!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send request");
    }
  };

  if (loading) return <Spinner fullPage />;

  return (
    <div className="profile-container">
      <div className="profile-two-column">
        {/* Left: Profile Card */}
        <div>
          <div className="card profile-card">
            <Avatar name={profile?.name} size="lg" />
            <h1 className="profile-name">{profile?.name}</h1>
            <p className="profile-college">{profile?.college}</p>

            {/* Contact Info */}
            {(profile?.email || profile?.phone) && (
              <div className="profile-section contact-info">
                {profile?.email && (
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <p className="info-value">{profile.email}</p>
                  </div>
                )}
                {profile?.mobile && (
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <p className="info-value">{profile.mobile}</p>
                  </div>
                )}
              </div>
            )}

            {/* Skills Offered */}
            {profile?.skillsOffered && profile.skillsOffered.length > 0 && (
              <div className="profile-section">
                <h3 className="section-title">Skills I Offer</h3>
                <div className="skills-display">
                  {profile.skillsOffered.map((s, i) => (
                    <SkillPill key={i} skill={s} variant="offered" />
                  ))}
                </div>
              </div>
            )}

            {/* Skills Needed */}
            {profile?.skillsNeeded && profile.skillsNeeded.length > 0 && (
              <div className="profile-section">
                <h3 className="section-title">Skills I Need</h3>
                <div className="skills-display">
                  {profile.skillsNeeded.map((s, i) => (
                    <SkillPill key={i} skill={s} variant="needed" />
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="profile-stats">
              <div className="stat">
                <div className="stat-value">★ {profile?.rating?.toFixed(1) || 0}</div>
                <div className="stat-label">Rating</div>
              </div>
              <div className="stat">
                <div className="stat-value">{profile?.sessionHistory?.length || 0}</div>
                <div className="stat-label">Sessions</div>
              </div>
            </div>

            {!isOwnProfile && (
              <button onClick={handleSendRequest} className="btn-connect">
                Connect
              </button>
            )}
          </div>

          {/* About */}
          <div className="card">
            <h3>About</h3>
            <p>{profile?.bio || "No bio added"}</p>
          </div>

          {/* Reviews */}
          {profile?.reviews && profile.reviews.length > 0 && (
            <div className="card">
              <h3>Reviews ({profile.reviews.length})</h3>
              {profile.reviews.map((review, i) => (
                <div key={i} className="review">
                  <div className="review-header">
                    <strong>{review.reviewer?.name || "Anonymous"}</strong>
                    <span className="review-rating">★ {review.score}</span>
                  </div>
                  <p>{review.feedback}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Edit Form (Only for own profile) */}
        {isOwnProfile && (
          <div className="card">
            <h2>{isEdit ? "Edit Profile" : "Your Profile"}</h2>

            {isEdit ? (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editData.mobile}
                    onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Experience Level</label>
                  <select
                    value={editData.experienceLevel}
                    onChange={(e) => setEditData({ ...editData, experienceLevel: e.target.value })}
                    className="select"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Skills I Can Teach</label>
                  <div className="skills-display">
                    {editData.skillsOffered.map((s, i) => (
                      <SkillPill
                        key={i}
                        skill={s}
                        variant="offered"
                        onRemove={() => setEditData({
                          ...editData,
                          skillsOffered: editData.skillsOffered.filter((_, idx) => idx !== i)
                        })}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add skill (press Enter)"
                    className="input"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        setEditData({
                          ...editData,
                          skillsOffered: [...editData.skillsOffered, e.target.value.trim()]
                        });
                        e.target.value = "";
                      }
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Skills I Want to Learn</label>
                  <div className="skills-display">
                    {editData.skillsNeeded.map((s, i) => (
                      <SkillPill
                        key={i}
                        skill={s}
                        variant="needed"
                        onRemove={() => setEditData({
                          ...editData,
                          skillsNeeded: editData.skillsNeeded.filter((_, idx) => idx !== i)
                        })}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add skill (press Enter)"
                    className="input"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        setEditData({
                          ...editData,
                          skillsNeeded: [...editData.skillsNeeded, e.target.value.trim()]
                        });
                        e.target.value = "";
                      }
                    }}
                  />
                </div>

                <div className="button-row">
                  <button onClick={handleSaveProfile} className="btn-save">Save</button>
                  <button onClick={() => setIsEdit(false)} className="btn-cancel">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Email:</strong> {profile?.email || "Not provided"}</p>
                <p><strong>Phone:</strong> {profile?.mobile || "Not provided"}</p>
                <p><strong>Bio:</strong> {profile?.bio || "No bio"}</p>
                <p><strong>Experience:</strong> {profile?.experienceLevel}</p>

                <div>
                  <p><strong>Teaching:</strong></p>
                  <div className="skills-display">
                    {(profile?.skillsOffered || []).map((s, i) => (
                      <SkillPill key={i} skill={s} variant="offered" />
                    ))}
                  </div>
                </div>

                <div>
                  <p><strong>Learning:</strong></p>
                  <div className="skills-display">
                    {(profile?.skillsNeeded || []).map((s, i) => (
                      <SkillPill key={i} skill={s} variant="needed" />
                    ))}
                  </div>
                </div>

                <button onClick={() => setIsEdit(true)} className="btn-edit">Edit Profile</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

