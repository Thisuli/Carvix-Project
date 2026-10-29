import { useLocation, Link } from "react-router-dom";
import { useState } from "react";

import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./TrackBooking.css";

function TrackBooking() {
  const location = useLocation();

  const incomingBooking = location.state || {};

  function createBookingReference(bookingData) {
    if (bookingData?.bookingReference) {
      return bookingData.bookingReference;
    }

    if (bookingData?._id) {
      const year = bookingData.createdAt
        ? new Date(bookingData.createdAt).getFullYear()
        : new Date().getFullYear();

      const shortId = bookingData._id
        .slice(-6)
        .toUpperCase();

      return `CVX-${year}-${shortId}`;
    }

    return "";
  }

  const incomingReference =
    incomingBooking.bookingReference ||
    createBookingReference(incomingBooking);

  const [reference, setReference] = useState(
    incomingReference
  );

  const [booking, setBooking] = useState(
    incomingBooking._id
      ? {
          ...incomingBooking,
          bookingReference: incomingReference,
          serviceName:
            incomingBooking.serviceName ||
            incomingBooking.serviceType,
        }
      : null
  );

  const [searched, setSearched] = useState(
    Boolean(incomingBooking._id)
  );

  const [loading, setLoading] = useState(false);

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function getSubmittedDate() {
    if (!booking?.createdAt) {
      return "Not available";
    }

    return formatDate(booking.createdAt);
  }

  async function findBooking(referenceValue) {
    const normalizedReference = referenceValue
      .trim()
      .toUpperCase();

    const response = await api.get(
      `/bookings/track/${encodeURIComponent(
        normalizedReference
      )}`
    );

    const foundBooking = response.data;

    return {
      ...foundBooking,
      bookingReference:
        createBookingReference(foundBooking),
      serviceName:
        foundBooking.serviceType,
    };
  }

  async function handleLookup(event) {
    event.preventDefault();

    if (!reference.trim()) {
      alert("Please enter your booking reference.");
      return;
    }

    try {
      setLoading(true);

      const foundBooking = await findBooking(
        reference
      );

      setBooking(foundBooking);
      setReference(
        foundBooking.bookingReference
      );

      setSearched(true);
    } catch (error) {
      console.error(
        "Booking lookup failed:",
        error
      );

      setBooking(null);
      setSearched(false);

      if (error.response?.status === 404) {
        alert(
          "Booking not found. Please check your booking reference."
        );
      } else {
        alert(
          "Unable to find your booking. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function refreshStatus() {
    if (!booking?.bookingReference) {
      return;
    }

    try {
      setLoading(true);

      const updatedBooking =
        await findBooking(
          booking.bookingReference
        );

      setBooking(updatedBooking);

      alert("Booking status refreshed.");
    } catch (error) {
      console.error(
        "Status refresh failed:",
        error
      );

      alert(
        "Unable to refresh the booking status."
      );
    } finally {
      setLoading(false);
    }
  }

  function statusClass() {
    if (!booking?.status) {
      return "";
    }

    return booking.status.toLowerCase();
  }

  return (
    <div className="track-page">
      <Navbar />

      {/* HERO */}
      <section className="track-hero">
        <div className="track-hero-inner">
          <div className="track-hero-copy">
            <span className="track-badge">
              ● &nbsp; TRACK YOUR SERVICE
            </span>

            <h1>
              Know exactly
              <br />
              where your
              <br />
              booking <span>stands.</span>
            </h1>

            <p>
              Enter your Carvix booking reference to view
              the latest appointment information and
              current service status. Your booking details
              stay clear from request to completion.
            </p>
          </div>

          {/* LOOKUP */}
          <form
            className="booking-lookup-card"
            onSubmit={handleLookup}
          >
            <span className="lookup-eyebrow">
              BOOKING LOOKUP
            </span>

            <h2>Find your booking.</h2>

            <p>
              Use the reference you received after
              submitting your service request.
            </p>

            <div className="lookup-form">
              <input
                type="text"
                value={reference}
                onChange={(event) =>
                  setReference(event.target.value)
                }
                placeholder="CVX-2026-ABC123"
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Searching..."
                  : "Track Booking →"}
              </button>
            </div>

            <small>
              Enter the reference shown on your booking
              confirmation.
            </small>
          </form>
        </div>

        <div className="track-hero-circle" />
      </section>

      {/* MAIN */}
      <main className="track-main">
        <div className="track-grid">

          {/* LEFT */}
          {searched && booking && (
            <section className="current-booking-card">
              <div className="current-booking-header">
                <div>
                  <span className="track-section-eyebrow">
                    CURRENT BOOKING
                  </span>

                  <h2>Your service appointment.</h2>
                </div>

                <span
                  className={`booking-status-pill ${statusClass()}`}
                >
                  ● {booking.status.toUpperCase()}
                </span>
              </div>

              <div className="track-reference-box">
                <div>
                  <span>BOOKING REFERENCE</span>

                  <strong>
                    {booking.bookingReference}
                  </strong>
                </div>

                <div className="last-checked">
                  <span>LAST CHECKED</span>

                  <strong>
                    Latest booking information
                  </strong>

                  <small>Just now</small>
                </div>
              </div>

              <div className="track-details-heading">
                <h3>Booking details</h3>

                <p>
                  The latest information saved for this
                  service request.
                </p>
              </div>

              <div className="track-details-grid">
                <div>
                  <span>CUSTOMER NAME</span>

                  <strong>
                    {booking.customerName}
                  </strong>
                </div>

                <div>
                  <span>PHONE NUMBER</span>

                  <strong>
                    {booking.phone}
                  </strong>
                </div>

                <div>
                  <span>VEHICLE NUMBER</span>

                  <strong>
                    {booking.vehicleNumber}
                  </strong>
                </div>

                <div>
                  <span>SERVICE TYPE</span>

                  <strong>
                    {booking.serviceName ||
                      booking.serviceType}
                  </strong>
                </div>

                <div>
                  <span>SERVICE DATE</span>

                  <strong>
                    {formatDate(booking.date)}
                  </strong>
                </div>

                <div>
                  <span>SERVICE TIME</span>

                  <strong>
                    {booking.time}
                  </strong>
                </div>

                <div>
                  <span>CURRENT STATUS</span>

                  <strong>
                    {booking.status}
                  </strong>
                </div>

                <div>
                  <span>SUBMITTED</span>

                  <strong>
                    {getSubmittedDate()}
                  </strong>
                </div>
              </div>

              <div className="track-progress-card">
                <div className="track-progress-heading">
                  <h3>Booking progress</h3>

                  <span>
                    Your booking is currently{" "}
                    {booking.status.toLowerCase()}.
                  </span>
                </div>

                <div className="track-progress">
                  <div className="track-progress-step completed">
                    <div className="track-progress-circle">
                      ✓
                    </div>

                    <strong>Submitted</strong>
                    <small>Request received</small>
                  </div>

                  <div
                    className={`track-progress-line ${
                      booking.status === "Approved" ||
                      booking.status === "Completed"
                        ? "completed-line"
                        : ""
                    }`}
                  />

                  <div
                    className={`track-progress-step ${
                      booking.status === "Approved" ||
                      booking.status === "Completed"
                        ? "completed"
                        : ""
                    }`}
                  >
                    <div className="track-progress-circle">
                      {booking.status === "Approved" ||
                      booking.status === "Completed"
                        ? "✓"
                        : "2"}
                    </div>

                    <strong>Approved</strong>
                    <small>Booking approved</small>
                  </div>

                  <div
                    className={`track-progress-line ${
                      booking.status === "Completed"
                        ? "completed-line"
                        : ""
                    }`}
                  />

                  <div
                    className={`track-progress-step ${
                      booking.status === "Completed"
                        ? "completed"
                        : ""
                    }`}
                  >
                    <div className="track-progress-circle">
                      {booking.status === "Completed"
                        ? "✓"
                        : "3"}
                    </div>

                    <strong>Completed</strong>
                    <small>Service complete</small>
                  </div>
                </div>
              </div>

              <div className="track-actions">
                <button
                  type="button"
                  className="refresh-status-button"
                  onClick={refreshStatus}
                  disabled={loading}
                >
                  {loading
                    ? "Refreshing..."
                    : "Refresh Status ↻"}
                </button>

                <Link
                  to="/book-service"
                  className="track-secondary-button"
                >
                  Book Another Service
                </Link>

                <Link
                  to="/"
                  className="track-secondary-button"
                >
                  Return Home
                </Link>
              </div>
            </section>
          )}

          {/* RIGHT */}
          <aside className="track-sidebar">
            <div className="status-guide-card">
              <span className="status-guide-eyebrow">
                BOOKING STATUS GUIDE
              </span>

              <h2>
                Understand every update.
              </h2>

              <div className="status-guide-list">
                <div>
                  <span>01</span>

                  <div>
                    <strong>Pending</strong>

                    <p>
                      Your request has been submitted and
                      is waiting for administrator review.
                    </p>
                  </div>
                </div>

                <div>
                  <span>02</span>

                  <div>
                    <strong>Approved</strong>

                    <p>
                      The service center has approved the
                      booking request.
                    </p>
                  </div>
                </div>

                <div>
                  <span>03</span>

                  <div>
                    <strong>Completed</strong>

                    <p>
                      The scheduled vehicle service has
                      been completed.
                    </p>
                  </div>
                </div>

                <div>
                  <span>04</span>

                  <div>
                    <strong>Rejected</strong>

                    <p>
                      The booking request was not approved.
                      The customer can create a new request.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tracking-tips-card">
              <h3>Tracking tips</h3>

              <p>
                Keep your booking reference available until
                your service is complete.
              </p>

              <ul>
                <li>
                  <span>✓</span>
                  Check the latest status before your
                  appointment.
                </li>

                <li>
                  <span>✓</span>
                  Review your service date and time.
                </li>

                <li>
                  <span>✓</span>
                  Create a new booking if a request is
                  rejected.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TrackBooking;