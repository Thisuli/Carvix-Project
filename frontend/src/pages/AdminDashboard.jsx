import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import AdminSidebar from "../components/AdminSidebar";

import "./AdminDashboard.css";

/* =========================
   ACTION ICONS
========================= */

function ActionIcon({ type }) {
  if (type === "view") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (type === "reject") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All statuses");

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =========================
     BOOKING REFERENCE
  ========================= */

  function createBookingReference(booking) {
    if (booking.bookingReference) {
      return booking.bookingReference;
    }

    if (!booking._id) {
      return "CVX-UNKNOWN";
    }

    const year = booking.createdAt
      ? new Date(
          booking.createdAt
        ).getFullYear()
      : new Date().getFullYear();

    const shortId = booking._id
      .slice(-6)
      .toUpperCase();

    return `CVX-${year}-${shortId}`;
  }

  /* =========================
     DATE HELPERS
  ========================= */

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatFullDate(dateValue) {
    const date = new Date(dateValue);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function getLocalDateString(dateValue) {
    const date = new Date(dateValue);

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  /* =========================
     TRANSFORM BOOKING
  ========================= */

  function transformBooking(booking) {
    return {
      id: booking._id,

      reference:
        createBookingReference(booking),

      customer:
        booking.customerName ||
        "Not available",

      phone:
        booking.phone ||
        "Not available",

      vehicle:
        booking.vehicleNumber ||
        "Not available",

      service:
        booking.serviceType ||
        "Not available",

      date: booking.date,

      displayDate: `${formatDate(
        booking.date
      )} · ${
        booking.time ||
        "Not available"
      }`,

      status:
        booking.status ||
        "Pending",

      createdAt:
        booking.createdAt,

      original: booking,
    };
  }

  /* =========================
     LOAD BOOKINGS
  ========================= */

  async function loadBookings() {
    try {
      setLoading(true);

      const response =
        await api.get("/bookings");

      const transformed =
        response.data.map(
          transformBooking
        );

      setBookings(transformed);
    } catch (error) {
      console.error(
        "Failed to load dashboard bookings:",
        error
      );

      alert(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  /* =========================
     COUNTS / KPI DATA
  ========================= */

  const counts = useMemo(() => {
    const pending =
      bookings.filter(
        (booking) =>
          booking.status === "Pending"
      ).length;

    const approved =
      bookings.filter(
        (booking) =>
          booking.status === "Approved"
      ).length;

    const completed =
      bookings.filter(
        (booking) =>
          booking.status === "Completed"
      ).length;

    const rejected =
      bookings.filter(
        (booking) =>
          booking.status === "Rejected"
      ).length;

    const today =
      getLocalDateString(new Date());

    const todaysBookings =
      bookings.filter((booking) => {
        if (!booking.date) {
          return false;
        }

        return (
          getLocalDateString(
            booking.date
          ) === today
        );
      }).length;

    return {
      total: bookings.length,
      pending,
      approved,
      completed,
      rejected,
      todaysBookings,
    };
  }, [bookings]);

  const stats = [
    {
      label: "Total Bookings",
      value: counts.total,
      code: "TB",
      caption:
        "All service requests",
    },
    {
      label: "Pending",
      value: counts.pending,
      code: "PN",
      caption:
        "Awaiting admin review",
    },
    {
      label: "Approved",
      value: counts.approved,
      code: "AP",
      caption:
        "Confirmed bookings",
    },
    {
      label: "Completed",
      value: counts.completed,
      code: "CP",
      caption:
        "Services completed",
    },
    {
      label: "Today's Bookings",
      value: counts.todaysBookings,
      code: "DY",
      caption:
        "Scheduled today",
    },
  ];

  /* =========================
     LAST 7 DAYS ACTIVITY
  ========================= */

  const activity = useMemo(() => {
    const result = [];

    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);

      date.setDate(
        date.getDate() - index
      );

      const targetDate =
        getLocalDateString(date);

      const value =
        bookings.filter(
          (booking) => {
            if (
              !booking.createdAt
            ) {
              return false;
            }

            return (
              getLocalDateString(
                booking.createdAt
              ) === targetDate
            );
          }
        ).length;

      result.push({
        day: date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        ),
        value,
      });
    }

    return result;
  }, [bookings]);

  /* =========================
     FILTER BOOKINGS
  ========================= */

  const filteredBookings =
    useMemo(() => {
      return bookings.filter(
        (booking) => {
          const query =
            search
              .toLowerCase()
              .trim();

          const matchesSearch =
            !query ||
            booking.customer
              .toLowerCase()
              .includes(query) ||
            booking.vehicle
              .toLowerCase()
              .includes(query) ||
            booking.reference
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter ===
              "All statuses" ||
            booking.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      bookings,
      search,
      statusFilter,
    ]);

  /* =========================
     UPDATE STATUS
  ========================= */

  async function updateStatus(
    bookingId,
    newStatus
  ) {
    try {
      const response =
        await api.put(
          `/bookings/${bookingId}/status`,
          {
            status: newStatus,
          }
        );

      const updatedBooking =
        transformBooking(
          response.data
        );

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? updatedBooking
            : booking
        )
      );
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );

      alert(
        "Unable to update booking status."
      );
    }
  }

  /* =========================
     VIEW BOOKING
  ========================= */

  function viewBooking(booking) {
    const details = [
      `Reference: ${booking.reference}`,
      `Customer: ${booking.customer}`,
      `Phone: ${booking.phone}`,
      `Vehicle: ${booking.vehicle}`,
      `Service: ${booking.service}`,
      `Date: ${formatDate(
        booking.date
      )}`,
      `Status: ${booking.status}`,
    ].join("\n");

    alert(details);
  }

  function statusClass(status) {
    return status.toLowerCase();
  }

  function manageServices() {
    navigate(
      "/admin/service-categories"
    );
  }

  const maxActivityValue =
    Math.max(
      ...activity.map(
        (item) => item.value
      ),
      1
    );

  return (
    <div className="admin-dashboard-page">
      <AdminSidebar />

      <div className="admin-dashboard-content">

        {/* HEADER */}
        <header className="admin-dashboard-header">
          <div>
            <span>
              ADMINISTRATION
            </span>

            <strong>
              Vehicle Service Management
            </strong>
          </div>

          <div className="dashboard-header-actions">
            <button
              type="button"
              className="dashboard-refresh"
              aria-label="Refresh dashboard"
              onClick={loadBookings}
              disabled={loading}
            >
              ↻
            </button>

            <button
              type="button"
              className="manage-services-button"
              onClick={manageServices}
            >
              + Manage Services
            </button>
          </div>
        </header>

        <main className="dashboard-main">

          {/* TITLE */}
          <div className="dashboard-title-row">
            <div>
              <span>
                DASHBOARD OVERVIEW
              </span>

              <h1>
                Good morning,
                Administrator.
              </h1>

              <p>
                Review service activity,
                manage bookings, and keep
                Carvix operations moving.
              </p>
            </div>

            <div className="dashboard-date">
              {formatFullDate(
                new Date()
              )}
            </div>
          </div>

          {/* KPI CARDS */}
          <section className="dashboard-stat-grid">
            {stats.map((stat) => (
              <div
                className="dashboard-stat-card"
                key={stat.label}
              >
                <div className="stat-card-top">
                  <span>
                    {stat.label}
                  </span>

                  <div>
                    {stat.code}
                  </div>
                </div>

                <strong>
                  {stat.value}
                </strong>

                <small>
                  {stat.caption}
                </small>
              </div>
            ))}
          </section>

          {/* CHARTS */}
          <section className="dashboard-chart-grid">

            <div className="activity-card">
              <div className="dashboard-card-heading">
                <div>
                  <h2>
                    Daily booking activity
                  </h2>

                  <p>
                    Booking volume across
                    the last seven days.
                  </p>
                </div>

                <span>
                  This Week
                </span>
              </div>

              <div className="activity-chart">
                {activity.map(
                  (item, index) => (
                    <div
                      className="activity-column"
                      key={`${item.day}-${index}`}
                    >
                      <span className="activity-value">
                        {item.value}
                      </span>

                      <div className="activity-bar-area">
                        <div
                          className="activity-bar"
                          style={{
                            height:
                              item.value ===
                              0
                                ? "4px"
                                : `${
                                    (item.value /
                                      maxActivityValue) *
                                    140
                                  }px`,
                          }}
                        />
                      </div>

                      <small>
                        {item.day}
                      </small>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="status-breakdown-card">
              <div className="dashboard-card-heading">
                <div>
                  <h2>
                    Status breakdown
                  </h2>

                  <p>
                    Distribution of all
                    current bookings.
                  </p>
                </div>
              </div>

              <div className="status-donut">
                <div className="status-donut-center">
                  <strong>
                    {counts.total}
                  </strong>

                  <span>
                    Total
                  </span>
                </div>
              </div>

              <div className="status-legend">
                <div>
                  <span className="legend-dot pending" />

                  Pending{" "}
                  {counts.pending}
                </div>

                <div>
                  <span className="legend-dot approved" />

                  Approved{" "}
                  {counts.approved}
                </div>

                <div>
                  <span className="legend-dot completed" />

                  Completed{" "}
                  {counts.completed}
                </div>

                <div>
                  <span className="legend-dot rejected" />

                  Rejected{" "}
                  {counts.rejected}
                </div>
              </div>
            </div>
          </section>

          {/* BOOKING MANAGEMENT */}
          <section className="booking-management-card">
            <div className="booking-management-heading">
              <div>
                <h2>
                  Booking management
                </h2>

                <p>
                  View all bookings,
                  filter records, and
                  update service statuses.
                </p>
              </div>

              <div className="booking-counts">
                <span>
                  {
                    filteredBookings.length
                  }{" "}
                  visible
                </span>

                <span>
                  {bookings.length} total
                </span>
              </div>
            </div>

            {/* FILTERS */}
            <div className="dashboard-booking-filters">
              <input
                type="text"
                placeholder="Search customer, vehicle or reference..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option>
                  All statuses
                </option>

                <option>
                  Pending
                </option>

                <option>
                  Approved
                </option>

                <option>
                  Completed
                </option>

                <option>
                  Rejected
                </option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearch("");

                  setStatusFilter(
                    "All statuses"
                  );
                }}
              >
                Clear Filters
              </button>
            </div>

            {/* TABLE */}
            <div className="dashboard-table-wrapper">
              <table className="dashboard-booking-table">
                <thead>
                  <tr>
                    <th>
                      REFERENCE
                    </th>

                    <th>
                      CUSTOMER
                    </th>

                    <th>
                      VEHICLE
                    </th>

                    <th>
                      SERVICE
                    </th>

                    <th>
                      DATE & TIME
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTIONS
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map(
                    (booking) => (
                      <tr key={booking.id}>
                        <td>
                          <strong>
                            {
                              booking.reference
                            }
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {
                              booking.customer
                            }
                          </strong>

                          <small>
                            {
                              booking.phone
                            }
                          </small>
                        </td>

                        <td>
                          {
                            booking.vehicle
                          }
                        </td>

                        <td>
                          {
                            booking.service
                          }
                        </td>

                        <td>
                          {
                            booking.displayDate
                          }
                        </td>

                        <td>
                          <span
                            className={`dashboard-status ${statusClass(
                              booking.status
                            )}`}
                          >
                            ●{" "}
                            {
                              booking.status
                            }
                          </span>
                        </td>

                        <td>
                          <div className="dashboard-row-actions">

                            {booking.status ===
                              "Pending" && (
                              <>
                                <button
                                  type="button"
                                  className="approve"
                                  onClick={() =>
                                    updateStatus(
                                      booking.id,
                                      "Approved"
                                    )
                                  }
                                >
                                  <span className="action-icon">
                                    <ActionIcon type="approve" />
                                  </span>

                                  <span>
                                    Approve
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  className="reject"
                                  onClick={() =>
                                    updateStatus(
                                      booking.id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  <span className="action-icon">
                                    <ActionIcon type="reject" />
                                  </span>

                                  <span>
                                    Reject
                                  </span>
                                </button>
                              </>
                            )}

                            {booking.status ===
                              "Approved" && (
                              <>
                                <button
                                  type="button"
                                  className="complete"
                                  onClick={() =>
                                    updateStatus(
                                      booking.id,
                                      "Completed"
                                    )
                                  }
                                >
                                  <span className="action-icon">
                                    <ActionIcon type="complete" />
                                  </span>

                                  <span>
                                    Complete
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  className="reject"
                                  onClick={() =>
                                    updateStatus(
                                      booking.id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  <span className="action-icon">
                                    <ActionIcon type="reject" />
                                  </span>

                                  <span>
                                    Reject
                                  </span>
                                </button>
                              </>
                            )}

                            {booking.status ===
                              "Rejected" && (
                              <button
                                type="button"
                                className="approve"
                                onClick={() =>
                                  updateStatus(
                                    booking.id,
                                    "Approved"
                                  )
                                }
                              >
                                <span className="action-icon">
                                  <ActionIcon type="approve" />
                                </span>

                                <span>
                                  Approve
                                </span>
                              </button>
                            )}

                            <button
                              type="button"
                              className="view"
                              onClick={() =>
                                viewBooking(
                                  booking
                                )
                              }
                            >
                              <span className="action-icon">
                                <ActionIcon type="view" />
                              </span>

                              <span>
                                View
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {loading && (
                <div className="no-bookings-found">
                  Loading booking
                  records...
                </div>
              )}

              {!loading &&
                filteredBookings.length ===
                  0 && (
                  <div className="no-bookings-found">
                    No booking records
                    found.
                  </div>
                )}
            </div>

            <div className="dashboard-table-footer">
              <span>
                Showing{" "}
                {filteredBookings.length >
                0
                  ? `1–${filteredBookings.length}`
                  : "0"}{" "}
                of {bookings.length}{" "}
                bookings
              </span>

              <div className="dashboard-pagination">
                <button className="active">
                  1
                </button>
              </div>
            </div>
          </section>

          <footer className="dashboard-footer">
            © 2026 Carvix · Vehicle
            Service Booking & Management
            System · Admin Portal
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;