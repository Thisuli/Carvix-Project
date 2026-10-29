import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import heroImage from "../assets/hero-carvix.png";
import whyCarvixImage from "../assets/why-carvix.png";

import oilChangeImage from "../assets/oil-change.jpg";
import fullServiceImage from "../assets/full-vehicle-service.jpg";
import brakeInspectionImage from "../assets/brake-inspection.jpg";
import engineDiagnosticsImage from "../assets/engine-diagnostics.jpg";
import batteryServiceImage from "../assets/battery-service.jpg";
import tyreServiceImage from "../assets/tyre-service.jpg";

import "./Home.css";

function StepIcon({ type }) {
  if (type === "service") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.3 2.3-3-3 2.3-2.3Z" />
      </svg>
    );
  }

  if (type === "time") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  }

  if (type === "request") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="m5 7 7 5 7-5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s6-5 6-11a6 6 0 1 0-12 0c0 6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

function Home() {
  const services = [
    {
      title: "Oil Change",
      image: oilChangeImage,
      description:
        "Professional oil and filter replacement to protect engine performance and efficiency.",
    },
    {
      title: "Full Vehicle Service",
      image: fullServiceImage,
      description:
        "Comprehensive maintenance and inspection designed to keep your vehicle road-ready.",
    },
    {
      title: "Brake Inspection",
      image: brakeInspectionImage,
      description:
        "Detailed braking-system inspection focused on safety and responsive vehicle performance.",
    },
    {
      title: "Engine Diagnostics",
      image: engineDiagnosticsImage,
      description:
        "Professional diagnostics for warning lights, engine issues and performance concerns.",
    },
    {
      title: "Battery Service",
      image: batteryServiceImage,
      description:
        "Battery inspection and testing to help prevent unexpected electrical and starting issues.",
    },
    {
      title: "Tyre Service",
      image: tyreServiceImage,
      description:
        "Tyre inspection and maintenance to support better grip, handling and safety.",
    },
  ];

  const steps = [
    {
      icon: "service",
      title: "Choose a Service",
      text: "Select the maintenance or inspection service your vehicle requires.",
    },
    {
      icon: "time",
      title: "Choose Your Time",
      text: "Select your preferred appointment date and available time.",
    },
    {
      icon: "request",
      title: "Send Your Request",
      text: "Add your vehicle and contact information and confirm the booking.",
    },
    {
      icon: "track",
      title: "Track Progress",
      text: "Follow your appointment from request to approval and completion.",
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-copy">
            <span className="small-label">
              VEHICLE CARE, REIMAGINED
            </span>

            <h1>
              Better care.
              <br />
              Better journeys.
              <br />
              <span>One Carvix.</span>
            </h1>

            <p>
              A smarter vehicle-service experience that connects customers
              and service centers through simple booking, clear appointment
              tracking and structured service management.
            </p>

            <div className="hero-actions">
              <Link to="/book-service" className="primary-button">
                Book Your Service →
              </Link>

              <a href="#services" className="secondary-button">
                Explore Services
              </a>
            </div>

            <div className="hero-points">
              <span>✓ Easy booking</span>
              <span>✓ Track progress</span>
              <span>✓ Secure management</span>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src={heroImage}
              alt="Carvix service technician"
            />

            <div className="approval-card">
              <small>BOOKING STATUS</small>
              <strong>Appointment Approved</strong>
            </div>

            <div className="hero-service-card">
              <small>YOUR SERVICE</small>
              <strong>
                Full Vehicle Service · 10:30 AM
              </strong>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div>
            <strong>Anytime</strong>
            <span>Book services online</span>
          </div>

          <div>
            <strong>4 Steps</strong>
            <span>A simple booking process</span>
          </div>

          <div>
            <strong>Live</strong>
            <span>Track appointment status</span>
          </div>

          <div>
            <strong>Secure</strong>
            <span>Protected admin system</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section" id="services">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">
              OUR SERVICES
            </span>

            <h2>
              Everything your vehicle needs.
              <br />
              One seamless experience.
            </h2>

            <p>
              Choose the service you need and schedule
              your appointment without phone calls,
              waiting or complicated processes.
            </p>
          </div>

          <Link
            to="/book-service"
            className="light-button"
          >
            Explore all services →
          </Link>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <article
              className="service-card"
              key={service.title}
            >
              <img
                src={service.image}
                alt={service.title}
              />

              <div className="service-card-body">
                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <Link to="/book-service">
                  Book this service →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HOW CARVIX WORKS */}
      <section
        className="process-section"
        id="how-it-works"
      >
        <span className="section-eyebrow process-eyebrow">
          HOW CARVIX WORKS
        </span>

        <h2>
          A complete booking experience in
          <br />
          four simple steps.
        </h2>

        <div className="process-grid">
          {steps.map((step) => (
            <div
              className="process-card"
              key={step.title}
            >
              <div className="process-icon">
                <StepIcon type={step.icon} />
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM */}
      <section
        className="platform-section"
        id="platform"
      >
        <span className="section-eyebrow">
          ONE CONNECTED PLATFORM
        </span>

        <h2>
          Simple for customers.
          <br />
          Powerful for service teams.
        </h2>

        <p className="platform-description">
          Carvix connects the entire service-booking
          workflow through two focused experiences.
        </p>

        <div className="platform-grid">
          <div className="platform-card">
            <span className="mini-badge">
              CUSTOMER VIEW
            </span>

            <h3>
              Booking designed to feel effortless.
            </h3>

            <p>
              Customers can select a service, enter
              their vehicle details and schedule an
              appointment in just a few steps.
            </p>

            <div className="mock-form">
              <label>
                CUSTOMER
                <div>John Smith</div>
              </label>

              <label>
                VEHICLE
                <div>AB 123 CD</div>
              </label>

              <label>
                SERVICE
                <div>Full Vehicle Service</div>
              </label>

              <label>
                APPOINTMENT
                <div>15 October · 10:30 AM</div>
              </label>

              <Link
                to="/book-service"
                className="mock-submit"
              >
                Confirm Booking →
              </Link>
            </div>
          </div>

          <div className="platform-card">
            <span className="mini-badge">
              ADMIN SYSTEM
            </span>

            <h3>
              Everything organized in one dashboard.
            </h3>

            <p>
              Administrators can monitor appointments,
              update booking status and manage service
              categories.
            </p>

            <div className="dashboard-preview">
              <div className="dashboard-title">
                <span>Booking Overview</span>
                <small>Today</small>
              </div>

              <div className="dashboard-stats">
                <div>
                  <strong>128</strong>
                  <span>Total</span>
                </div>

                <div>
                  <strong>16</strong>
                  <span>Pending</span>
                </div>

                <div>
                  <strong>31</strong>
                  <span>Completed</span>
                </div>

                <div>
                  <strong>83</strong>
                  <span>Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CARVIX */}
      <section className="why-section">
        <div className="why-image">
          <img
            src={whyCarvixImage}
            alt="Carvix technician working on a vehicle"
          />

          <div className="why-caption">
            <small>OUR SERVICE PROMISE</small>

            <strong>
              Technology that makes vehicle servicing simpler.
            </strong>
          </div>
        </div>

        <div className="why-content">
          <span className="section-eyebrow">
            WHY CARVIX
          </span>

          <h2>
            Less waiting. Less
            <br />
            confusion. Better
            <br />
            service.
          </h2>

          <p>
            Traditional manual scheduling can create
            booking conflicts, delays and missing
            information. Carvix replaces that process
            with a clear digital workflow.
          </p>

          <div className="benefit-list">
            <div>
              <span>01</span>

              <div>
                <h3>
                  Convenient Online Booking
                </h3>

                <p>
                  Customers can request appointments
                  without unnecessary phone calls.
                </p>
              </div>
            </div>

            <div>
              <span>02</span>

              <div>
                <h3>
                  Centralized Management
                </h3>

                <p>
                  Every service request remains
                  organized in one system.
                </p>
              </div>
            </div>

            <div>
              <span>03</span>

              <div>
                <h3>
                  Transparent Status Tracking
                </h3>

                <p>
                  Customers can clearly see the
                  progress of their appointment.
                </p>
              </div>
            </div>

            <div>
              <span>04</span>

              <div>
                <h3>
                  Secure Administration
                </h3>

                <p>
                  Protected admin access keeps
                  appointment management controlled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRACK BOOKING */}
      <section className="tracking-section">
        <div className="tracking-copy">
          <span className="section-eyebrow">
            TRACK YOUR SERVICE
          </span>

          <h2>
            Know exactly where
            <br />
            your booking stands.
          </h2>

          <p>
            Use your Carvix booking reference to check
            your appointment status whenever you need
            it.
          </p>

          <Link
            to="/track-booking"
            className="primary-button"
          >
            Track Booking →
          </Link>
        </div>

        <div className="booking-status-card">
          <div className="status-top">
            <div>
              <small>BOOKING REFERENCE</small>
              <h3>CVX-2026-0042</h3>
            </div>

            <span className="approved-pill">
              ✓ APPROVED
            </span>
          </div>

          <div className="booking-details">
            <div>
              <span>SERVICE</span>
              <strong>
                Full Vehicle Service
              </strong>
            </div>

            <div>
              <span>VEHICLE</span>
              <strong>AB 123 CD</strong>
            </div>

            <div>
              <span>DATE</span>
              <strong>15 October 2026</strong>
            </div>

            <div>
              <span>TIME</span>
              <strong>10:30 AM</strong>
            </div>
          </div>

          <div className="status-line">
            <div className="status-point complete">
              <span>✓</span>
              <small>Submitted</small>
            </div>

            <div className="line complete-line" />

            <div className="status-point complete">
              <span>✓</span>
              <small>Approved</small>
            </div>

            <div className="line" />

            <div className="status-point">
              <span>○</span>
              <small>Completed</small>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-wrapper">
        <div className="cta-section">
          <div>
            <h2>
              Your vehicle deserves better care.
              <br />
              Carvix makes it easier.
            </h2>

            <p>
              Book the service you need, choose your
              appointment and keep everything
              organized from request to completion.
            </p>
          </div>

          <Link
            to="/book-service"
            className="cta-button"
          >
            Book Your Service →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;