import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../useAuth";
import Navbar from "../components/Navbar";
import "../styles/pages/LoginPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    college: ""
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) newErrors.mobile = "Valid 10-digit mobile required";
    if (!formData.college) newErrors.college = "College name required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.mobile, formData.college);
    setLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setErrors({ submit: result.error });
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-panel-left">
          <h1>Exchange Skills, Not Money</h1>
          <p>Join college students teaching and learning together — completely free.</p>
          <ul className="auth-features">
            <li>✓ Teach what you know best</li>
            <li>✓ Learn skills for free</li>
            <li>✓ Connect with your college peers</li>
          </ul>
        </div>

      <div className="auth-panel-right">
        <div className="auth-form-wrapper">
          <h2>Create Your Account</h2>
          <p className="auth-subheading">Start swapping skills in minutes</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label>College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="Your college"
                className={errors.college ? "input-error" : ""}
              />
              {errors.college && <div className="error-text">{errors.college}</div>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                placeholder="10-digit mobile"
                className={errors.mobile ? "input-error" : ""}
              />
              {errors.mobile && <div className="error-text">{errors.mobile}</div>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 6 characters"
                className={errors.password ? "input-error" : ""}
              />
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill strength-${strength}`}></div>
                  </div>
                  <div className={`strength-label strength-label-${strength}`}>{strengthLabels[strength]}</div>
                </div>
              )}
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <button type="submit" disabled={loading} className="btn-auth-submit">
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="auth-terms">
              By creating an account you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>

            <p className="auth-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
    </>
    );
}
