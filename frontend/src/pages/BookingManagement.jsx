import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import AdminSidebar from "../components/AdminSidebar";

import "./BookingManagement.css";

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

  if (type === "delete") {
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
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
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

function BookingManagement() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All statuses");

  const [serviceFilter, setServiceFilter] =
    useState("All services");

  const [dateFilter, setDateFilter] = useState("");

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  function createBookingReference(booking) {
    if (booking.bookingReference) {
      return booking.bookingReference;
    }

    if (!booking._id) {
      return "CVX-UNKNOWN";
    }

    const year = booking.createdAt
      ? new Date(booking.createdAt).getFullYear()
      : new Date().getFullYear();

    const shortId = booking._id
      .slice(-6)
      .toUpperCase();

    return `CVX-${year}-${shortId}`;
  }

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

  function getDateValue(dateValue) {
    if (!dateValue) {
      return "";
    }

    return dateValue.slice(0, 10);
  }

  function transformBooking(booking) {
    return {
      id: booking._id,

      reference: createBookingReference(booking),

      customer:
        booking.customerName || "Not available",

      phone:
        booking.phone || "Not available",

      vehicle:
        booking.vehicleNumber || "Not available",

      vehicleModel:
        booking.vehicleModel ||
        booking.vehicleType ||
        "Not provided",

      service:
        booking.serviceType || "Not available",

      date:
        getDateValue(booking.date),

      displayDate: `${formatDate(
        booking.date
      )} · ${booking.time || "Not available"}`,

      time:
        booking.time || "Not available",

      status:
        booking.status || "Pending",

      createdAt:
        booking.createdAt,

      original:
        booking,
    };
  }

  async function loadBookings() {
    try {
      setLoading(true);

      const response = await api.get("/bookings");

      const transformedBookings =
        response.data.map(transformBooking);

      setBookings(transformedBookings);
    } catch (error) {
      console.error(
        "Failed to load bookings:",
        error
      );

      alert(
        "Unable to load bookings from the server."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const stats = useMemo(() => {
    const pending = bookings.filter(
      (booking) =>
        booking.status === "Pending"
    ).length;

    const approved = bookings.filter(
      (booking) =>
        booking.status === "Approved"
    ).length;

    const completed = bookings.filter(
      (booking) =>
        booking.status === "Completed"
    ).length;

    const rejected = bookings.filter(
      (booking) =>
        booking.status === "Rejected"
    ).length;

    return [
      {
        label: "All Bookings",
        value: bookings.length,
        code: "≡",
        caption:
          "Complete booking database",
      },
      {
        label: "Pending",
        value: pending,
        code: "◷",
        caption:
          "Awaiting administrator review",
      },
      {
        label: "Approved",
        value: approved,
        code: "✓",
        caption:
          "Confirmed service appointments",
      },
      {
        label: "Completed",
        value: completed,
        code: "✓",
        caption:
          "Finished vehicle services",
      },
      {
        label: "Rejected",
        value: rejected,
        code: "×",
        caption:
          "Requests not approved",
      },
    ];
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query =
        search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        booking.reference
          .toLowerCase()
          .includes(query) ||
        booking.customer
          .toLowerCase()
          .includes(query) ||
        booking.phone
          .toLowerCase()
          .includes(query) ||
        booking.vehicle
          .toLowerCase()
          .includes(query) ||
        booking.vehicleModel
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All statuses" ||
        booking.status === statusFilter;

      const matchesService =
        serviceFilter === "All services" ||
        booking.service === serviceFilter;

      const matchesDate =
        !dateFilter ||
        booking.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService &&
        matchesDate
      );
    });
  }, [
    bookings,
    search,
    statusFilter,
    serviceFilter,
    dateFilter,
  ]);

  async function updateStatus(
    bookingId,
    newStatus
  ) {
    try {
      const response = await api.put(
        `/bookings/${bookingId}/status`,
        {
          status: newStatus,
        }
      );

      const updatedBooking =
        transformBooking(response.data);

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? updatedBooking
            : booking
        )
      );
    } catch (error) {
      console.error(
        "Failed to update booking status:",
        error
      );

      alert(
        "Unable to update the booking status."
      );
    }
  }

  async function deleteBooking(booking) {
    const confirmed = window.confirm(
      `Delete booking ${booking.reference}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/bookings/${booking.id}`
      );

      setBookings((current) =>
        current.filter(
          (item) =>
            item.id !== booking.id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete booking:",
        error
      );

      alert(
        "Unable to delete the booking."
      );
    }
  }

  function viewBooking(booking) {
    const details = [
      `Reference: ${booking.reference}`,
      `Customer: ${booking.customer}`,
      `Phone: ${booking.phone}`,
      `Vehicle: ${booking.vehicle}`,
      `Service: ${booking.service}`,
      `Date: ${formatDate(
        booking.original.date
      )}`,
      `Time: ${booking.time}`,
      `Status: ${booking.status}`,
    ].join("\n");

    alert(details);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All statuses");
    setServiceFilter("All services");
    setDateFilter("");
  }

  function statusClass(status) {
    return status.toLowerCase();
  }

  return (
    <div className="booking-management-page">
      <AdminSidebar />

      <div className="booking-management-content">

        {/* HEADER */}
        <header className="booking-admin-header">
          <div>
            <span>ADMINISTRATION</span>
            <strong>
              Booking Management
            </strong>
          </div>

          <div className="booking-admin-header-actions">
            <button
              type="button"
              className="booking-refresh-button"
              aria-label="Refresh bookings"
              onClick={loadBookings}
              disabled={loading}
            >
              ↻
            </button>

            <button
              type="button"
              className="back-dashboard-button"
              onClick={() =>
                navigate("/admin-dashboard")
              }
            >
              ← Dashboard
            </button>
          </div>
        </header>

        <main className="booking-management-main">

          {/* TITLE */}
          <section className="booking-management-intro">
            <div>
              <span>
                BOOKING OPERATIONS
              </span>

              <h1>
                Manage every service booking.
              </h1>

              <p>
                Review customer requests, locate booking
                records quickly, inspect full appointment
                details, and update each service request
                from Pending to Approved, Completed, or
                Rejected.
              </p>
            </div>

            <div className="total-booking-pill">
              {bookings.length} total bookings
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="booking-summary-grid">
            {stats.map((stat) => (
              <div
                className="booking-summary-card-admin"
                key={stat.label}
              >
                <div className="booking-summary-card-top">
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

          {/* RECORDS CARD */}
          <section className="all-bookings-card">
            <div className="all-bookings-heading">
              <div>
                <h2>
                  All booking records
                </h2>

                <p>
                  Search, filter, review, update, or
                  remove service-booking records.
                </p>
              </div>

              <div className="booking-record-counts">
                <span>
                  {filteredBookings.length} visible
                </span>

                <span>
                  {bookings.length} total
                </span>
              </div>
            </div>

            {/* FILTERS */}
            <div className="booking-record-filters">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search reference, customer, phone, vehicle..."
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

              <select
                value={serviceFilter}
                onChange={(event) =>
                  setServiceFilter(
                    event.target.value
                  )
                }
              >
                <option>
                  All services
                </option>

                <option>
                  Oil Change
                </option>

                <option>
                  Full Vehicle Service
                </option>

                <option>
                  Brake Inspection
                </option>

                <option>
                  Engine Diagnostics
                </option>

                <option>
                  Battery Service
                </option>

                <option>
                  Tyre Service
                </option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(
                    event.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>

            {/* TABLE */}
            <div className="booking-record-table-wrapper">
              <table className="booking-record-table">
                <thead>
                  <tr>
                    <th>REFERENCE</th>
                    <th>CUSTOMER</th>
                    <th>VEHICLE</th>
                    <th>SERVICE</th>
                    <th>DATE & TIME</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map(
                    (booking) => (
                      <tr key={booking.id}>
                        <td>
                          <strong>
                            {booking.reference}
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {booking.customer}
                          </strong>

                          <small>
                            {booking.phone}
                          </small>
                        </td>

                        <td>
                          <strong>
                            {booking.vehicle}
                          </strong>

                          <small>
                            {booking.vehicleModel}
                          </small>
                        </td>

                        <td>
                          {booking.service}
                        </td>

                        <td>
                          {booking.displayDate}
                        </td>

                        <td>
                          <span
                            className={`booking-record-status ${statusClass(
                              booking.status
                            )}`}
                          >
                            ● {booking.status}
                          </span>
                        </td>

                        <td>
                          <div className="booking-record-actions">

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
                                  <span className="record-action-icon">
                                    <ActionIcon type="approve" />
                                  </span>

                                  Approve
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
                                  <span className="record-action-icon">
                                    <ActionIcon type="reject" />
                                  </span>

                                  Reject
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
                                  <span className="record-action-icon">
                                    <ActionIcon type="complete" />
                                  </span>

                                  Complete
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
                                  <span className="record-action-icon">
                                    <ActionIcon type="reject" />
                                  </span>

                                  Reject
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
                                <span className="record-action-icon">
                                  <ActionIcon type="approve" />
                                </span>

                                Approve
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
                              <span className="record-action-icon">
                                <ActionIcon type="view" />
                              </span>

                              View
                            </button>

                            <button
                              type="button"
                              className="delete"
                              onClick={() =>
                                deleteBooking(
                                  booking
                                )
                              }
                            >
                              <span className="record-action-icon">
                                <ActionIcon type="delete" />
                              </span>

                              Delete
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
                  Loading booking records...
                </div>
              )}

              {!loading &&
                filteredBookings.length === 0 && (
                  <div className="no-bookings-found">
                    No booking records match your filters.
                  </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="booking-record-footer">
              <span>
                Showing{" "}
                {filteredBookings.length > 0
                  ? `1–${filteredBookings.length}`
                  : "0"}{" "}
                of {bookings.length} bookings
              </span>

              <div className="booking-management-pagination">
                <button className="active">
                  1
                </button>
              </div>
            </div>
          </section>

          <footer className="booking-admin-footer">
            © 2026 Carvix · Vehicle Service Booking &
            Management System · Admin Portal
          </footer>
        </main>
      </div>
    </div>
  );
}

export default BookingManagement;