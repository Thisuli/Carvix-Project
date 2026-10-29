import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import AdminSidebar from "../components/AdminSidebar";

import "./Settings.css";

/* =========================
   SETTINGS TAB ICONS
========================= */

function SettingsIcon({ type }) {
  if (type === "account") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6" />
      </svg>
    );
  }

  if (type === "service") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6.5 9.5V20h11V9.5" />
        <path d="M10 20v-6h4v6" />
      </svg>
    );
  }

  if (type === "booking") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2"
        />

        <path d="M8 3v4M16 3v4M4 9h16" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    );
  }

  if (type === "security") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <rect
          x="6"
          y="10"
          width="12"
          height="10"
          rx="2"
        />

        <path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3" />

        <circle
          cx="12"
          cy="15"
          r="1"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
      />

      <circle
        cx="12"
        cy="12"
        r="3"
      />

      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}

function Settings() {
  const navigate = useNavigate();

  const accountRef = useRef(null);
  const serviceRef = useRef(null);
  const bookingRef = useRef(null);
  const securityRef = useRef(null);
  const systemRef = useRef(null);

  const [activeTab, setActiveTab] =
    useState("account");

  const [account, setAccount] =
    useState({
      displayName: "Administrator",
      username: "admin",
      email: "admin@carvix.lk",
      role: "System Administrator",
    });

  const [serviceCenter, setServiceCenter] =
    useState({
      name:
        "Carvix Vehicle Service Center",

      phone:
        "+94 71 234 5678",

      email:
        "service@carvix.lk",

      timezone:
        "Asia/Colombo (GMT+05:30)",

      address:
        "Colombo, Sri Lanka",
    });

  const [preferences, setPreferences] =
    useState({
      defaultStatus: "Pending",
      duration: "60 minutes",
      openingTime: "08:00",
      closingTime: "18:00",
      bookingConfirmation: true,
      statusTracking: true,
      adminReview: true,
      completedHistory: true,
    });

  const [passwords, setPasswords] =
    useState({
      current: "",
      newPassword: "",
      confirmPassword: "",
    });

  function scrollToSection(
    sectionName
  ) {
    setActiveTab(sectionName);

    const refs = {
      account: accountRef,
      service: serviceRef,
      booking: bookingRef,
      security: securityRef,
      system: systemRef,
    };

    const target =
      refs[sectionName]?.current;

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function handleAccountChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setAccount((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleServiceCenterChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setServiceCenter((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handlePreferenceChange(
    event
  ) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setPreferences((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function handlePasswordChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setPasswords((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function saveAccount(event) {
    event.preventDefault();

    alert(
      "Administrator account saved."
    );
  }

  function saveServiceCenter(
    event
  ) {
    event.preventDefault();

    alert(
      "Service center details saved."
    );
  }

  function savePreferences(event) {
    event.preventDefault();

    alert(
      "Booking preferences saved."
    );
  }

  async function updatePassword(
    event
  ) {
    event.preventDefault();

    if (
      !passwords.current ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      alert(
        "Please complete all password fields."
      );

      return;
    }

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      alert(
        "New passwords do not match."
      );

      return;
    }

    if (
      passwords.newPassword.length <
      8
    ) {
      alert(
        "New password must be at least 8 characters long."
      );

      return;
    }

    try {
      const response =
        await api.put(
          "/auth/change-password",
          {
            currentPassword:
              passwords.current,

            newPassword:
              passwords.newPassword,
          }
        );

      alert(
        response.data.message
      );

      setPasswords({
        current: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Password update failed:",
        error
      );

      const message =
        error.response?.data
          ?.message ||
        "Unable to update password.";

      alert(message);
    }
  }

  function endCurrentSession() {
    localStorage.removeItem(
      "carvixAdminToken"
    );

    localStorage.removeItem(
      "carvixAdmin"
    );

    sessionStorage.removeItem(
      "carvixAdminToken"
    );

    sessionStorage.removeItem(
      "carvixAdmin"
    );

    navigate("/admin-login");
  }

  return (
    <div className="settings-page">
      <AdminSidebar />

      <div className="settings-content">

        {/* HEADER */}
        <header className="settings-header">
          <div>
            <span>
              ADMINISTRATION
            </span>

            <strong>
              System Settings
            </strong>
          </div>

          <div className="settings-header-actions">
            <button
              type="button"
              className="settings-refresh-button"
              aria-label="Refresh settings"
            >
              ↻
            </button>

            <button
              type="button"
              className="settings-dashboard-button"
              onClick={() =>
                navigate(
                  "/admin-dashboard"
                )
              }
            >
              ← Dashboard
            </button>
          </div>
        </header>

        <main className="settings-main">

          {/* INTRO */}
          <section className="settings-intro">
            <div>
              <span>
                ADMIN CONFIGURATION
              </span>

              <h1>
                Control Carvix from one place.
              </h1>

              <p>
                Manage the administrator
                account, service-center
                details, booking
                preferences, security
                controls, and essential
                system information without
                leaving the admin portal.
              </p>
            </div>

            <div className="protected-settings-pill">
              ● Protected settings
            </div>
          </section>

          {/* SETTINGS NAVIGATION */}
          <div className="settings-tabs">

            <button
              type="button"
              className={
                activeTab === "account"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection(
                  "account"
                )
              }
            >
              <span className="settings-tab-icon">
                <SettingsIcon type="account" />
              </span>

              Account
            </button>

            <button
              type="button"
              className={
                activeTab === "service"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection(
                  "service"
                )
              }
            >
              <span className="settings-tab-icon">
                <SettingsIcon type="service" />
              </span>

              Service Center
            </button>

            <button
              type="button"
              className={
                activeTab === "booking"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection(
                  "booking"
                )
              }
            >
              <span className="settings-tab-icon">
                <SettingsIcon type="booking" />
              </span>

              Booking Preferences
            </button>

            <button
              type="button"
              className={
                activeTab === "security"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection(
                  "security"
                )
              }
            >
              <span className="settings-tab-icon">
                <SettingsIcon type="security" />
              </span>

              Security
            </button>

            <button
              type="button"
              className={
                activeTab === "system"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection(
                  "system"
                )
              }
            >
              <span className="settings-tab-icon">
                <SettingsIcon type="system" />
              </span>

              System
            </button>
          </div>

          {/* ACCOUNT */}
          <section
            ref={accountRef}
            className="settings-card settings-scroll-section"
          >
            <div className="settings-card-heading">
              <div>
                <h2>
                  Administrator account
                </h2>

                <p>
                  Update the profile
                  information used for the
                  Carvix administrator
                  portal.
                </p>
              </div>

              <span>
                ACCOUNT
              </span>
            </div>

            <form
              className="settings-form"
              onSubmit={saveAccount}
            >
              <div className="admin-account-banner">
                <div className="settings-admin-avatar">
                  AD
                </div>

                <div>
                  <strong>
                    Administrator
                  </strong>

                  <span>
                    Primary Carvix
                    administration account
                    · Secure access enabled
                  </span>
                </div>
              </div>

              <div className="settings-form-grid">
                <label>
                  Display Name

                  <input
                    type="text"
                    name="displayName"
                    value={
                      account.displayName
                    }
                    onChange={
                      handleAccountChange
                    }
                  />
                </label>

                <label>
                  Username

                  <input
                    type="text"
                    name="username"
                    value={
                      account.username
                    }
                    onChange={
                      handleAccountChange
                    }
                  />

                  <small>
                    Used when signing in to
                    the administration
                    portal.
                  </small>
                </label>

                <label>
                  Administrator Email

                  <input
                    type="email"
                    name="email"
                    value={
                      account.email
                    }
                    onChange={
                      handleAccountChange
                    }
                  />
                </label>

                <label>
                  Role

                  <input
                    type="text"
                    name="role"
                    value={
                      account.role
                    }
                    onChange={
                      handleAccountChange
                    }
                  />

                  <small>
                    The permissions given to
                    this administrator.
                  </small>
                </label>
              </div>

              <div className="settings-actions">
                <button
                  type="button"
                  className="settings-secondary-button"
                  onClick={() =>
                    setAccount({
                      displayName:
                        "Administrator",

                      username:
                        "admin",

                      email:
                        "admin@carvix.lk",

                      role:
                        "System Administrator",
                    })
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="settings-primary-button"
                >
                  Save Account
                </button>
              </div>
            </form>
          </section>

          {/* SERVICE CENTER */}
          <section
            ref={serviceRef}
            className="settings-card settings-scroll-section"
          >
            <div className="settings-card-heading">
              <div>
                <h2>
                  Service center information
                </h2>

                <p>
                  Maintain the basic contact
                  details displayed or used
                  across Carvix
                  communications.
                </p>
              </div>

              <span>
                BUSINESS
              </span>
            </div>

            <form
              className="settings-form"
              onSubmit={
                saveServiceCenter
              }
            >
              <div className="settings-form-grid">
                <label>
                  Service Center Name

                  <input
                    type="text"
                    name="name"
                    value={
                      serviceCenter.name
                    }
                    onChange={
                      handleServiceCenterChange
                    }
                  />
                </label>

                <label>
                  Contact Number

                  <input
                    type="text"
                    name="phone"
                    value={
                      serviceCenter.phone
                    }
                    onChange={
                      handleServiceCenterChange
                    }
                  />
                </label>

                <label>
                  Contact Email

                  <input
                    type="email"
                    name="email"
                    value={
                      serviceCenter.email
                    }
                    onChange={
                      handleServiceCenterChange
                    }
                  />
                </label>

                <label>
                  Business Time Zone

                  <input
                    type="text"
                    name="timezone"
                    value={
                      serviceCenter.timezone
                    }
                    onChange={
                      handleServiceCenterChange
                    }
                  />
                </label>

                <label className="settings-full-width">
                  Service Center Address

                  <input
                    type="text"
                    name="address"
                    value={
                      serviceCenter.address
                    }
                    onChange={
                      handleServiceCenterChange
                    }
                  />
                </label>
              </div>

              <div className="settings-actions">
                <button
                  type="button"
                  className="settings-secondary-button"
                  onClick={() =>
                    setServiceCenter({
                      name:
                        "Carvix Vehicle Service Center",

                      phone:
                        "+94 71 234 5678",

                      email:
                        "service@carvix.lk",

                      timezone:
                        "Asia/Colombo (GMT+05:30)",

                      address:
                        "Colombo, Sri Lanka",
                    })
                  }
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="settings-primary-button"
                >
                  Save Details
                </button>
              </div>
            </form>
          </section>

          {/* BOOKING PREFERENCES */}
          <section
            ref={bookingRef}
            className="settings-card settings-scroll-section"
          >
            <div className="settings-card-heading">
              <div>
                <h2>
                  Booking preferences
                </h2>

                <p>
                  Configure sensible
                  defaults for the
                  service-booking workflow.
                </p>
              </div>

              <span>
                BOOKINGS
              </span>
            </div>

            <form
              className="settings-form"
              onSubmit={
                savePreferences
              }
            >
              <div className="settings-form-grid">
                <label>
                  Default New Booking Status

                  <select
                    name="defaultStatus"
                    value={
                      preferences.defaultStatus
                    }
                    onChange={
                      handlePreferenceChange
                    }
                  >
                    <option>
                      Pending
                    </option>

                    <option>
                      Approved
                    </option>
                  </select>
                </label>

                <label>
                  Default Appointment Duration

                  <select
                    name="duration"
                    value={
                      preferences.duration
                    }
                    onChange={
                      handlePreferenceChange
                    }
                  >
                    <option>
                      30 minutes
                    </option>

                    <option>
                      45 minutes
                    </option>

                    <option>
                      60 minutes
                    </option>

                    <option>
                      90 minutes
                    </option>
                  </select>
                </label>

                <label>
                  Opening Time

                  <input
                    type="time"
                    name="openingTime"
                    value={
                      preferences.openingTime
                    }
                    onChange={
                      handlePreferenceChange
                    }
                  />
                </label>

                <label>
                  Closing Time

                  <input
                    type="time"
                    name="closingTime"
                    value={
                      preferences.closingTime
                    }
                    onChange={
                      handlePreferenceChange
                    }
                  />
                </label>
              </div>

              <div className="settings-toggle-grid">
                {[
                  {
                    name:
                      "bookingConfirmation",

                    title:
                      "Booking Confirmation",

                    text:
                      "Show customers a booking reference immediately after a successful request.",
                  },
                  {
                    name:
                      "statusTracking",

                    title:
                      "Status Tracking",

                    text:
                      "Allow customers to track booking status updates.",
                  },
                  {
                    name:
                      "adminReview",

                    title:
                      "Administrator Review",

                    text:
                      "Require an administrator to review incoming service requests.",
                  },
                  {
                    name:
                      "completedHistory",

                    title:
                      "Completed History",

                    text:
                      "Keep completed service requests available in history.",
                  },
                ].map((item) => (
                  <div
                    className="settings-toggle-card"
                    key={item.name}
                  >
                    <div>
                      <strong>
                        {item.title}
                      </strong>

                      <p>
                        {item.text}
                      </p>

                      <span>
                        Enabled
                      </span>
                    </div>

                    <label className="settings-switch">
                      <input
                        type="checkbox"
                        name={
                          item.name
                        }
                        checked={
                          preferences[
                            item.name
                          ]
                        }
                        onChange={
                          handlePreferenceChange
                        }
                      />

                      <span />
                    </label>
                  </div>
                ))}
              </div>

              <div className="settings-actions">
                <button
                  type="button"
                  className="settings-secondary-button"
                  onClick={() =>
                    setPreferences({
                      defaultStatus:
                        "Pending",

                      duration:
                        "60 minutes",

                      openingTime:
                        "08:00",

                      closingTime:
                        "18:00",

                      bookingConfirmation:
                        true,

                      statusTracking:
                        true,

                      adminReview:
                        true,

                      completedHistory:
                        true,
                    })
                  }
                >
                  Reset Defaults
                </button>

                <button
                  type="submit"
                  className="settings-primary-button"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </section>

          {/* SECURITY */}
          <section
            ref={securityRef}
            className="settings-card settings-scroll-section"
          >
            <div className="settings-card-heading">
              <div>
                <h2>
                  Security & password
                </h2>

                <p>
                  Protect administrator
                  access and manage the
                  current authenticated
                  session.
                </p>
              </div>

              <span>
                SECURITY
              </span>
            </div>

            <form
              className="settings-form"
              onSubmit={
                updatePassword
              }
            >
              <div className="settings-form-grid">
                <label className="settings-full-width">
                  Current Password

                  <input
                    type="password"
                    name="current"
                    value={
                      passwords.current
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                </label>

                <label>
                  New Password

                  <input
                    type="password"
                    name="newPassword"
                    value={
                      passwords.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Create a new password"
                    autoComplete="new-password"
                  />

                  <small>
                    Minimum 8 characters.
                  </small>
                </label>

                <label>
                  Confirm New Password

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      passwords.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Repeat the new password"
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <div className="settings-actions">
                <button
                  type="button"
                  className="end-session-button"
                  onClick={
                    endCurrentSession
                  }
                >
                  End Current Session
                </button>

                <button
                  type="submit"
                  className="settings-primary-button"
                >
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* SYSTEM */}
          <section
            ref={systemRef}
            className="settings-card settings-scroll-section"
          >
            <div className="settings-card-heading">
              <div>
                <h2>
                  System information
                </h2>

                <p>
                  Read-only project and
                  application information
                  for the Carvix
                  administration portal.
                </p>
              </div>

              <span>
                SYSTEM
              </span>
            </div>

            <div className="system-information-content">
              <div className="system-information-grid">
                <div>
                  <span>
                    APPLICATION
                  </span>

                  <strong>
                    Carvix
                  </strong>
                </div>

                <div>
                  <span>
                    SYSTEM TYPE
                  </span>

                  <strong>
                    Booking & Management
                  </strong>
                </div>

                <div>
                  <span>
                    ADMIN PORTAL
                  </span>

                  <strong>
                    Version 1.0
                  </strong>
                </div>

                <div>
                  <span>
                    API STATUS
                  </span>

                  <strong className="api-ready-status">
                    ● Ready for integration
                  </strong>
                </div>
              </div>

              <div className="settings-implementation-note">
                <strong>
                  Implementation note
                </strong>

                <p>
                  Settings such as
                  service-center details
                  and booking preferences
                  can later be connected
                  to MongoDB through the
                  Carvix backend.
                </p>
              </div>
            </div>
          </section>

          <footer className="settings-footer">
            © 2026 Carvix · Vehicle
            Service Booking & Management
            System · Admin Portal
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Settings;