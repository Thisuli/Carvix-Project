import { Link } from "react-router-dom";
import carvixLogo from "../assets/carvix-logo.png";
import "./Footer.css";

function Footer() {
  return (
    <footer className="carvix-footer" id="contact">
      <div className="footer-container">
        <div className="footer-main">
          {/* BRAND */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link">
              <img
                src={carvixLogo}
                alt="Carvix"
                className="footer-logo"
              />
            </Link>

            <p>
              Carvix is a modern Vehicle Service Booking & Management
              System designed to simplify appointment scheduling for
              customers and service-center administrators.
            </p>
          </div>

          {/* EXPLORE */}
          <div className="footer-column">
            <h3>Explore</h3>

            <a href="/#services">Services</a>
            <Link to="/book-service">Book Service</Link>
            <Link to="/track-booking">Track Booking</Link>
            <a href="/#how-it-works">How It Works</a>
          </div>

          {/* BOOKING */}
          <div className="footer-column">
            <h3>Booking</h3>

            <Link to="/book-service">Book Service</Link>
            <Link to="/track-booking">Track Booking</Link>
            <a href="/#platform">Our Platform</a>
          </div>

          {/* CARVIX */}
          <div className="footer-column">
            <h3>Carvix</h3>

            <a href="/#how-it-works">About</a>
            <a href="#contact">Contact</a>
            <Link to="/admin-login">Admin Login</Link>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© 2026 Carvix. All rights reserved.</p>

          <p>Vehicle Service Booking & Management System</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;