import { useLocation, useNavigate, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import bookingSubmittedImage from "../assets/booking-submitted.png";

import "./BookingConfirmation.css";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state || {};

  function createBookingReference() {
    if (booking.bookingReference) {
      return booking.bookingReference;
    }

    if (booking._id) {
      const year = new Date().getFullYear();

      const shortId = booking._id
        .slice(-6)
        .toUpperCase();

      return `CVX-${year}-${shortId}`;
    }

    return "CVX-PENDING";
  }

  const bookingReference = createBookingReference();

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

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(bookingReference);
      alert("Booking reference copied.");
    } catch {
      alert(`Booking reference: ${bookingReference}`);
    }
  }

  function trackBooking() {
    navigate("/track-booking", {
      state: {
        ...booking,
        bookingReference,
        bookingId: booking._id,
      },
    });
  }

  const currentStatus = booking.status || "Pending";

  return (
    <div className="confirmation-page">
      <Navbar />

      {/* HERO */}
      <section className="confirmation-hero">
        <div className="confirmation-hero-inner">
          <div className="confirmation-image-wrapper">
            <img
              src={bookingSubmittedImage}
              alt="Carvix booking successfully submitted"
              className="confirmation-image"
            />
          </div>

          <span className="confirmation-badge">
            <span className="confirmation-badge-dot">●</span>
            BOOKING SUBMITTED
          </span>

          <h1>
            Your service request is
            <br />
            <span>confirmed.</span>
          </h1>

          <p>
            Your booking has been successfully submitted to Carvix.
            Keep your booking reference safe — you can use it to check
            the latest status of your service request at any time.
          </p>
        </div>

        <div className="confirmation-hero-circle" />
      </section>

      {/* MAIN */}
      <main className="confirmation-main">
        <div className="confirmation-grid">

          {/* LEFT */}
          <section className="confirmation-card">
            <div className="confirmation-card-header">
              <div>
                <span className="confirmation-eyebrow">
                  BOOKING CONFIRMATION
                </span>

                <h2>Your appointment request.</h2>
              </div>

              <span className="pending-pill">
                ● {currentStatus.toUpperCase()}
              </span>
            </div>

            <div className="reference-box">
              <div>
                <span>YOUR BOOKING REFERENCE</span>

                <strong>
                  {bookingReference}
                </strong>
              </div>

              <button
                type="button"
                onClick={copyReference}
              >
                Copy Reference
              </button>
            </div>

            <div className="booking-details-heading">
              <h3>Booking details</h3>

              <p>
                Review the information submitted with your request.
              </p>
            </div>

            <div className="confirmation-details-grid">
              <div>
                <span>CUSTOMER NAME</span>

                <strong>
                  {booking.customerName || "Not available"}
                </strong>
              </div>

              <div>
                <span>PHONE NUMBER</span>

                <strong>
                  {booking.phone || "Not available"}
                </strong>
              </div>

              <div>
                <span>VEHICLE NUMBER</span>

                <strong>
                  {booking.vehicleNumber || "Not available"}
                </strong>
              </div>

              <div>
                <span>SERVICE TYPE</span>

                <strong>
                  {booking.serviceName ||
                    booking.serviceType ||
                    "Not available"}
                </strong>
              </div>

              <div>
                <span>PREFERRED DATE</span>

                <strong>
                  {formatDate(booking.date)}
                </strong>
              </div>

              <div>
                <span>PREFERRED TIME</span>

                <strong>
                  {booking.time || "Not available"}
                </strong>
              </div>

              <div className="full-detail">
                <span>CURRENT STATUS</span>

                <strong>
                  {currentStatus === "Pending"
                    ? "Pending — awaiting administrator review"
                    : currentStatus}
                </strong>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="confirmation-progress">
              <div className="progress-heading">
                <h3>Booking progress</h3>

                <span>
                  Current status: {currentStatus}
                </span>
              </div>

              <div className="progress-track">
                <div className="progress-step completed">
                  <div className="progress-circle">
                    ✓
                  </div>

                  <strong>Submitted</strong>
                  <small>Request received</small>
                </div>

                <div className="progress-line" />

                <div className="progress-step">
                  <div className="progress-circle">
                    2
                  </div>

                  <strong>Approved</strong>
                  <small>Admin review</small>
                </div>

                <div className="progress-line" />

                <div className="progress-step">
                  <div className="progress-circle">
                    3
                  </div>

                  <strong>Completed</strong>
                  <small>Service complete</small>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="confirmation-actions">
              <button
                type="button"
                className="track-confirmation-button"
                onClick={trackBooking}
              >
                Track This Booking →
              </button>

              <Link
                to="/book-service"
                className="confirmation-secondary-button"
              >
                Book Another Service
              </Link>

              <Link
                to="/"
                className="confirmation-secondary-button"
              >
                Return Home
              </Link>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="confirmation-sidebar">
            <div className="next-steps-card">
              <span className="next-steps-eyebrow">
                WHAT HAPPENS NEXT?
              </span>

              <h2>
                Your Carvix journey has started.
              </h2>

              <div className="next-step-list">
                <div>
                  <span>01</span>

                  <div>
                    <strong>
                      Booking submitted
                    </strong>

                    <p>
                      Your service request has been recorded
                      with Pending status.
                    </p>
                  </div>
                </div>

                <div>
                  <span>02</span>

                  <div>
                    <strong>
                      Administrator review
                    </strong>

                    <p>
                      The service center reviews the request
                      and confirms availability.
                    </p>
                  </div>
                </div>

                <div>
                  <span>03</span>

                  <div>
                    <strong>
                      Status updated
                    </strong>

                    <p>
                      Track your booking to see the latest
                      service status.
                    </p>
                  </div>
                </div>

                <div>
                  <span>04</span>

                  <div>
                    <strong>
                      Service completed
                    </strong>

                    <p>
                      The booking is marked Completed after
                      the vehicle service is finished.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="reference-reminder-card">
              <div className="reference-icon">
                CVX
              </div>

              <h3>Remember your reference</h3>

              <p>
                Keep your booking reference safe. It is the
                easiest way to identify and track your Carvix
                service request.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BookingConfirmation;