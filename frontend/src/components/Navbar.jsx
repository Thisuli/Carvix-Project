import { Link } from "react-router-dom";
import carvixLogo from "../assets/carvix-logo.png";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        <img
          src={carvixLogo}
          alt="Carvix"
          className="navbar-logo-image"
        />
      </Link>

      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <a href="/#services">Services</a>
        <a href="/#how-it-works">How It Works</a>
        <a href="/#platform">Platform</a>
        <Link to="/track-booking">
          Track Booking
        </Link>
        <a href="/#contact">Contact</a>
      </nav>

      <div className="navbar-actions">
        <Link
          to="/admin-login"
          className="sign-in-btn"
        >
          Sign In
        </Link>

        <Link
          to="/book-service"
          className="book-service-btn"
        >
          Book Service →
        </Link>
      </div>
    </header>
  );
}

export default Navbar;