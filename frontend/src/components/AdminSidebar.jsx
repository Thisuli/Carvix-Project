import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import api from "../api/api";
import carvixLogo from "../assets/carvix-logo.png";

import "./AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    async function loadBookingCount() {
      try {
        const response = await api.get("/bookings");

        setBookingCount(response.data.length);
      } catch (error) {
        console.error(
          "Failed to load booking count:",
          error
        );
      }
    }

    loadBookingCount();
  }, []);

  function handleLogout() {
    localStorage.removeItem("carvixAdminToken");
    localStorage.removeItem("carvixAdmin");

    sessionStorage.removeItem("carvixAdminToken");
    sessionStorage.removeItem("carvixAdmin");

    navigate("/admin-login");
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-top">
        <div className="admin-sidebar-brand">
          <img
            src={carvixLogo}
            alt="Carvix"
            className="admin-sidebar-logo"
          />

          <div>
            <span>CARVIX ADMIN</span>
            <strong>Control Center</strong>
          </div>
        </div>

        <div className="admin-sidebar-divider" />

        <span className="admin-sidebar-label">
          WORKSPACE
        </span>

        <nav className="admin-sidebar-nav">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              isActive
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
          >
            <span className="admin-nav-icon">▦</span>

            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              isActive
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
          >
            <span className="admin-nav-icon">▣</span>

            <span>Bookings</span>

            <small>{bookingCount}</small>
          </NavLink>

          <NavLink
            to="/admin/service-categories"
            className={({ isActive }) =>
              isActive
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
          >
            <span className="admin-nav-icon">⌕</span>

            <span>Service Categories</span>
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              isActive
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
          >
            <span className="admin-nav-icon">♙</span>

            <span>Customers</span>
          </NavLink>
        </nav>

        <span className="admin-sidebar-label admin-system-label">
          SYSTEM
        </span>

        <nav className="admin-sidebar-nav">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              isActive
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
          >
            <span className="admin-nav-icon">⚙</span>

            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <div className="admin-sidebar-bottom">
        <div className="admin-profile-card">
          <div className="admin-avatar">
            AD
          </div>

          <div>
            <strong>Administrator</strong>
            <span>Secure session</span>
          </div>
        </div>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;