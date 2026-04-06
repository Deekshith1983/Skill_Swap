import { useNavigate } from "react-router-dom";
import "../styles/components/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="landing-navbar">
      <div className="navbar-container">
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          SkillSwap
        </div>
        <div className="nav-links">
          <a href="#how-it-works" className="nav-link">How it works</a>
          <button onClick={() => navigate("/register")} className="nav-btn nav-register">
            Register
          </button>
          <button onClick={() => navigate("/login")} className="nav-btn nav-login">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
