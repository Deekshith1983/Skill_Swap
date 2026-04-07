import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/pages/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Exchange skills, not money</h1>
          <p className="hero-subtitle">
            Connect with college students who have what you want to learn — and teach what you know best.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/register")} className="btn-primary">Get started free</button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <h2 className="section-title">HOW IT WORKS</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>List your skills</h3>
            <p>Add what you can teach and what you want to learn</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get matched</h3>
            <p>We find students with complementary skills</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Swap & learn</h3>
            <p>Schedule sessions, teach each other, leave reviews</p>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="trusted-by">
        <h3 className="section-title">TRUSTED BY STUDENTS AT</h3>
        <div className="colleges">
          <div className="college">IIT Bombay</div>
          <div className="college">BITS Pilani</div>
          <div className="college">NIT Trichy</div>
          <div className="college">VIT Vellore</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h3 className="section-title">WHAT STUDENTS SAY</h3>
        <div className="testimonials-grid">
          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p className="quote">"Learned Python in 2 weeks by teaching React. Best deal ever!"</p>
            <div className="testimonial-author">
              <div className="avatar">AK</div>
              <div className="author-info">
                <div className="author-name">Arjun, IIT Delhi</div>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p className="quote">"Found a Figma partner in 10 minutes. Super easy matching."</p>
            <div className="testimonial-author">
              <div className="avatar">NS</div>
              <div className="author-info">
                <div className="author-name">Neha, BITS Goa</div>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p className="quote">"Finally a platform made for college students. No money needed."</p>
            <div className="testimonial-author">
              <div className="avatar">RV</div>
              <div className="author-info">
                <div className="author-name">Rahul, NIT Trichy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2 className="cta-title">Ready to start swapping?</h2>
        <p className="cta-subtitle">Join 500+ students already exchanging skills</p>
        <button onClick={() => navigate("/register")} className="btn-cta">Create free account</button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2025 SkillSwap</p>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}