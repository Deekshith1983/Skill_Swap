import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../useAuth";
import Navbar from "../components/Navbar";
import "../styles/pages/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-panel-left">
          <h1>Welcome Back to SkillSwap</h1>
          <p>Pick up where you left off — continue swapping skills with your peers.</p>
          <ul className="auth-features">
            <li>Your sessions are waiting</li>
            <li>Check pending requests</li>
            <li>Find new skill matches</li>
          </ul>
        </div>

      <div className="auth-panel-right">
        <div className="auth-form-wrapper">
          <h2 className="auth-form-heading">Sign In</h2>
          <p className="auth-form-subheading">Enter your registered email and password</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <div className="auth-form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                autoComplete="email"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="auth-form-group">
              <div className="password-label-row">
                <label>Password</label>
                <a href="#" className="forgot-pwd">Forgot password?</a>
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Your password"
                autoComplete="current-password"
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button type="submit" disabled={loading} className="btn-auth-submit">
              {loading ? "Logging In..." : "Sign In"}
            </button>

            

            <p className="auth-link-text">
              Don't have an account? <Link to="/register" className="auth-link">Sign up free</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
