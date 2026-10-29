import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import carvixLogo from "../assets/carvix-logo.png";

import Footer from "../components/Footer";

import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.username.trim() ||
      !formData.password.trim()
    ) {
      alert(
        "Please enter your administrator username and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username: formData.username.trim(),
        password: formData.password,
      });

      const { token, admin } = response.data;

      if (formData.rememberMe) {
        localStorage.setItem(
          "carvixAdminToken",
          token
        );

        localStorage.setItem(
          "carvixAdmin",
          JSON.stringify(admin)
        );
      } else {
        sessionStorage.setItem(
          "carvixAdminToken",
          token
        );

        sessionStorage.setItem(
          "carvixAdmin",
          JSON.stringify(admin)
        );
      }

      navigate("/admin-dashboard");
    } catch (error) {
      console.error(
        "Admin login failed:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to sign in.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      {/* TOP BAR */}
      <header className="admin-login-header">
        <div className="admin-header-brand">
          <Link
            to="/"
            className="admin-header-logo-link"
          >
            <img
              src={carvixLogo}
              alt="Carvix"
              className="admin-header-logo"
            />
          </Link>

          <div className="admin-header-divider" />

          <div className="admin-header-copy">
            <span>ADMINISTRATION</span>
            <strong>Secure Sign In</strong>
          </div>
        </div>

        <Link
          to="/"
          className="back-to-site-button"
        >
          ← Back to Website
        </Link>
      </header>

      {/* MAIN */}
      <main className="admin-login-main">
        <div className="admin-login-grid">

          {/* LEFT PANEL */}
          <section className="admin-info-panel">
            <div className="admin-brand-row">
              <img
                src={carvixLogo}
                alt="Carvix"
                className="admin-panel-logo"
              />

              <div>
                <span>
                  CARVIX ADMINISTRATION
                </span>

                <strong>
                  Vehicle Service Management
                </strong>
              </div>
            </div>

            <div className="admin-info-content">
              <span className="secure-access-label">
                SECURE ADMIN ACCESS
              </span>

              <h1>
                Manage every
                <br />
                booking with
                <br />
                <span>clarity.</span>
              </h1>

              <p>
                Sign in to the Carvix administration
                portal to review service bookings,
                update appointment statuses, manage
                service categories, and oversee daily
                operations from one secure workspace.
              </p>
            </div>

            <div className="admin-feature-list">
              <div className="admin-feature-item">
                <span>01</span>

                <div>
                  <strong>
                    Protected administrator access
                  </strong>

                  <p>
                    Only authenticated administrators
                    can access management features.
                  </p>
                </div>
              </div>

              <div className="admin-feature-item">
                <span>02</span>

                <div>
                  <strong>
                    Booking status management
                  </strong>

                  <p>
                    Review requests and manage Pending,
                    Approved, Completed, or Rejected
                    states.
                  </p>
                </div>
              </div>

              <div className="admin-feature-item">
                <span>03</span>

                <div>
                  <strong>
                    Centralized administration
                  </strong>

                  <p>
                    Continue to bookings, dashboard
                    metrics, and service-category
                    management after login.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* LOGIN CARD */}
          <section className="admin-login-card">
            <span className="admin-portal-badge">
              ● &nbsp; ADMIN PORTAL
            </span>

            <h2>Welcome back.</h2>

            <p className="admin-login-intro">
              Enter your administrator credentials to
              continue to the Carvix management system.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="admin-login-label">
                Username *

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter administrator username"
                  autoComplete="username"
                  required
                />
              </label>

              <label className="admin-login-label">
                Password *

                <div className="admin-password-wrapper">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="show-password-button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </label>

              <div className="admin-form-options">
                <label className="remember-admin">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />

                  <span>
                    Keep me signed in
                  </span>
                </label>

                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() =>
                    alert(
                      "Password recovery will be connected later."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="admin-security-note">
                <span>✓</span>

                <p>
                  This area is reserved for Carvix
                  administrators. Authentication is
                  verified before protected management
                  pages are shown.
                </p>
              </div>

              <button
                type="submit"
                className="admin-signin-button"
                disabled={loading}
              >
                {loading
                  ? "Signing In..."
                  : "Sign In to Admin Portal →"}
              </button>
            </form>

            <div className="admin-login-divider" />

            <div className="admin-help-card">
              <div className="admin-help-icon">
                ↗
              </div>

              <div>
                <strong>
                  Protected admin session
                </strong>

                <p>
                  JWT-based authentication enabled.
                </p>
              </div>

              <span className="secure-pill">
                ✓ SECURE
              </span>
            </div>

            <div className="admin-help-card password-help">
              <div className="admin-help-icon">
                ?
              </div>

              <div>
                <strong>
                  Forgot your password?
                </strong>

                <p>
                  If you cannot access your
                  administrator account, use the
                  password recovery process or contact
                  the system owner.
                </p>

                <button
                  type="button"
                  className="reset-password-button"
                  onClick={() =>
                    alert(
                      "Password reset will be connected later."
                    )
                  }
                >
                  Reset Password
                </button>
              </div>
            </div>

            <p className="request-access-text">
              Need an administrator account?{" "}
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Administrator access requests will be handled later."
                  )
                }
              >
                Request access
              </button>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminLogin;