import { useEffect, useState } from "react";
import { searchUsers, getSkillSuggestions } from "../services/searchService";
import { getComplementaryMatches } from "../services/matchService";
import { sendRequest } from "../services/requestService";
import Avatar from "../components/common/Avatar";
import Spinner from "../components/common/Spinner";
import { Link } from "react-router-dom";
import "../styles/pages/SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState({});
  const [filter, setFilter] = useState({
    experienceLevel: "",
    minRating: 0,
    sort: "matchScore"
  });

  // Load complementary matches on page render
  useEffect(() => {
    loadComplementaryMatches();
  }, []);

  const loadComplementaryMatches = async () => {
    try {
      setLoading(true);
      const res = await getComplementaryMatches();
      setResults(res.data?.users || []);
      setHasSearched(false);
    } catch (error) {
      console.error("Failed to load matches:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (query.trim()) {
      const debounce = setTimeout(() => {
        handleSearch();
      }, 400);
      return () => clearTimeout(debounce);
    }
  }, [query, filter]);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await searchUsers(query, {
        experienceLevel: filter.experienceLevel || undefined,
        minRating: filter.minRating || undefined
      });
      let users = res.data.users || [];
      if (filter.sort === "rating") {
        users.sort((a, b) => b.rating - a.rating);
      } else if (filter.sort === "recent") {
        users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setResults(users);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestions = async (value) => {
    try {
      if (value.trim()) {
        const res = await getSkillSuggestions(value);
        setSuggestions(res.data.suggestions || []);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Failed to get suggestions:", error);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setHasSearched(false);
    loadComplementaryMatches();
  };

  const handleConnect = async (userId, userSkillOffered, userSkillNeeded) => {
    try {
      // Disable the button immediately
      setDisabledButtons(prev => ({
        ...prev,
        [userId]: true
      }));

      // Send request with the partner's skills
      // What partner offers = what you need
      // What partner needs = what you offer
      await sendRequest(
        userId,
        userSkillNeeded || "Skill",      // You're offering what they need
        userSkillOffered || "Skill"      // You're requesting what they offer
      );

      // Optional: Show success message
      alert("Connection request sent!");
    } catch (error) {
      console.error("Failed to send request:", error);
      // Re-enable button on error
      setDisabledButtons(prev => ({
        ...prev,
        [userId]: false
      }));
      alert("Failed to send connection request");
    }
  };

  return (
    <div className="search-page-container">
      {/* Page Title */}
      <div className="search-header">
        <h1 className="search-title">Find skill matches</h1>
      </div>

      {/* Search & Filters Section */}
      <div className="search-section">
        <div className="search-box">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by skill — Python, Figma, ML..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSuggestions(e.target.value);
              }}
              className="search-input"
            />
            {query && <button onClick={handleClear} className="btn-clear">✕</button>}
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setQuery(s);
                    setSuggestions([]);
                  }}
                  className="suggestion-item"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="filters">
          <select
            value={filter.experienceLevel}
            onChange={(e) => setFilter({ ...filter, experienceLevel: e.target.value })}
            className="filter-select"
          >
            <option value="">Experience</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={filter.minRating}
            onChange={(e) => setFilter({ ...filter, minRating: parseFloat(e.target.value) })}
            className="filter-select"
          >
            <option value="0">Rating</option>
            <option value="3">★ 3+</option>
            <option value="4">★ 4+</option>
            <option value="4.5">★ 4.5+</option>
          </select>

          <button onClick={handleSearch} className="btn-search">Search</button>
        </div>
      </div>

      {/* Results Messages */}
      {!loading && results.length > 0 && (
        <div className="results-info">
          <p>
            {hasSearched
              ? `Showing ${results.length} results for "${query}"`
              : `Showing ${results.length} complementary matches for your profile · sorted by skill overlap`
            }
          </p>
        </div>
      )}

      {/* Results Grid */}
      {loading && <Spinner />}

      {/* No Results Found State */}
      {!loading && hasSearched && results.length === 0 && (
        <div className="no-results-container">
          <div className="no-results-box">
            <div className="no-results-icon">🔍</div>
            <h2 className="no-results-title">
              Skill "<strong>{query}</strong>" not found
            </h2>
            <p className="no-results-subtitle">
              No tutors found teaching this skill. Try searching for something else or explore suggestions below.
            </p>

            {/* Suggestions Section */}
            {suggestions.length > 0 && (
              <div className="suggestions-section">
                <h3 className="suggestions-title">Did you mean?</h3>
                <div className="suggestions-grid">
                  {suggestions.slice(0, 6).map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setQuery(suggestion);
                        setSuggestions([]);
                      }}
                      className="suggestion-card"
                    >
                      <span className="suggestion-text">{suggestion}</span>
                      <span className="suggestion-arrow">→</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Skills */}
            <div className="popular-skills-section">
              <h3 className="popular-title">Popular skills to learn</h3>
              <div className="popular-skills-grid">
                {["Python", "JavaScript", "React", "Java", "Web Design", "UI/UX", "Data Science", "Machine Learning"].map((skill, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(skill);
                      setSuggestions([]);
                    }}
                    className="popular-skill-btn"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Complementary Matches State */}
      {!loading && !hasSearched && results.length === 0 && (
        <div className="no-results-container">
          <div className="no-results-box">
            <div className="no-results-icon">👥</div>
            <h2 className="no-results-title">No complementary matches yet</h2>
            <p className="no-results-subtitle">
              Add more skills to your profile to find people who want to learn what you teach!
            </p>
            <Link to="/profile/me" className="btn-update-skills">Update your skills</Link>
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="results-container">
          <div className="results-grid">
            {results.map((user) => (
              <div key={user._id} className="user-card">
                <div className="card-top">
                  <Avatar name={user.name} size="md" />
                  <div className="user-header">
                    <h3>{user.name}</h3>
                    <span className="experience-badge">{user.experienceLevel || "Beginner"}</span>
                  </div>
                </div>

                <div className="user-meta">
                  <p className="college">{user.college}</p>
                  <p className="rating">★★★★★ {user.rating?.toFixed(1) || 0} · {user.sessionHistory?.length || 0} sessions</p>
                </div>

                <div className="card-section">
                  <p className="section-label">Teaches</p>
                  <div className="skills-list">
                    {user.skillsOffered?.slice(0, 3).map((s, i) => (
                      <span key={i} className="skill-pill-green">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="card-section">
                  <p className="section-label">Wants to learn</p>
                  <div className="skills-list">
                    {user.skillsNeeded?.slice(0, 3).map((s, i) => (
                      <span key={i} className="skill-pill-blue">{s}</span>
                    ))}
                  </div>
                </div>

                <p className="match-description">
                  Match your {user.skillsOffered?.slice(0, 2).join(" + ")} ↔ his {user.skillsNeeded?.slice(0, 2).join(" + ")}
                </p>

                <div className="card-actions">
                  <button 
                    onClick={() => handleConnect(user._id, user.skillsOffered?.[0], user.skillsNeeded?.[0])}
                    disabled={disabledButtons[user._id]}
                    className="btn-connect"
                  >
                    {disabledButtons[user._id] ? "Requested" : "Connect"}
                  </button>
                  <Link to={`/profile/${user._id}`} className="btn-profile">View profile</Link>
                </div>
              </div>
            ))}
          </div>

          {/* No More Matches */}
          {results.length > 0 && (
            <div className="no-more-matches">
              <p className="no-more-title">No more matches found</p>
              <p className="no-more-subtitle">Add more skills to find more students</p>
              <Link to="/profile/me" className="btn-update-skills">Update skills</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
