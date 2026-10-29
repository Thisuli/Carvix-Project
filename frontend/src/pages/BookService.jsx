import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./BookService.css";

function FeatureIcon({ type }) {
  if (type === "book") {
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

  if (type === "track") {
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
        <path d="M4 18h3l3-4 3 2 4-6 3 2" />

        <circle cx="4" cy="18" r="1.5" />
        <circle cx="10" cy="14" r="1.5" />
        <circle cx="13" cy="16" r="1.5" />
        <circle cx="17" cy="10" r="1.5" />
        <circle cx="20" cy="12" r="1.5" />
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
      <path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" />

      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BookService() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] =
    useState(true);

  const vehicleTypes = [
    "Car",
    "SUV",
    "Van",
    "Pickup",
    "Motorcycle",
    "Other",
  ];

  const times = [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
  ];

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    serviceType: "",
    date: "",
    time: "",
    notes: "",
  });

  const [submitting, setSubmitting] =
    useState(false);

  async function loadServices() {
    try {
      setLoadingServices(true);

      const response =
        await api.get("/services");

      setServices(response.data);
    } catch (error) {
      console.error(
        "Failed to load services:",
        error
      );

      alert(
        "Unable to load available services."
      );
    } finally {
      setLoadingServices(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const selectedService =
    services.find(
      (service) =>
        service._id ===
        formData.serviceType
    );

  function handleChange(event) {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function selectService(serviceId) {
    setFormData((current) => ({
      ...current,
      serviceType: serviceId,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.customerName ||
      !formData.phone ||
      !formData.vehicleNumber ||
      !formData.serviceType ||
      !formData.date ||
      !formData.time
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }

    try {
      setSubmitting(true);

      const bookingData = {
        customerName:
          formData.customerName,

        phone:
          formData.phone,

        vehicleNumber:
          formData.vehicleNumber,

        serviceType:
          selectedService?.name,

        date:
          formData.date,

        time:
          formData.time,
      };

      const response =
        await api.post(
          "/bookings",
          bookingData
        );

      navigate(
        "/booking-confirmation",
        {
          state: {
            ...formData,
            ...response.data,
            serviceName:
              selectedService?.name,
          },
        }
      );
    } catch (error) {
      console.error(
        "Booking submission failed:",
        error
      );

      alert(
        "Unable to submit your booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="book-service-page">
      <Navbar />

      <section className="booking-hero">
        <div className="booking-hero-inner">
          <div className="booking-hero-copy">
            <span className="booking-badge">
              ● &nbsp; BOOK YOUR SERVICE
            </span>

            <h1>
              Your car. Your
              <br />
              time.{" "}
              <span>
                Your Carvix.
              </span>
            </h1>

            <p>
              Choose the service your vehicle
              needs, tell us a little about your
              vehicle, and select your preferred
              appointment. We’ll keep the rest of
              the process organized for you.
            </p>
          </div>

          <div className="booking-process-card">
            <span className="process-caption">
              BOOKING PROCESS
            </span>

            <div className="booking-process-steps">
              <div className="booking-process-step active">
                <span>1</span>
                <strong>
                  Your Details
                </strong>
              </div>

              <div className="booking-process-line" />

              <div className="booking-process-step">
                <span>2</span>
                <strong>
                  Service
                </strong>
              </div>

              <div className="booking-process-line" />

              <div className="booking-process-step">
                <span>3</span>
                <strong>
                  Schedule
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="booking-main">
        <div className="booking-content-grid">

          <form
            className="booking-form-card"
            onSubmit={handleSubmit}
          >
            <div className="booking-form-heading">
              <span>
                SERVICE APPOINTMENT
              </span>

              <h2>
                Schedule your vehicle service.
              </h2>

              <p>
                Fields marked with * are required.
              </p>
            </div>

            <section className="booking-form-section">
              <div className="form-section-title">
                <span>01</span>
                <h3>
                  Customer Details
                </h3>
              </div>

              <div className="booking-form-grid">
                <label>
                  Full Name *

                  <input
                    type="text"
                    name="customerName"
                    value={
                      formData.customerName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </label>

                <label>
                  Phone Number *

                  <input
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="+94 77 123 4567"
                    required
                  />
                </label>

                <label className="full-width">
                  Email Address

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="yourname@example.com"
                  />

                  <small>
                    Optional — useful for future booking communication.
                  </small>
                </label>
              </div>
            </section>

            <section className="booking-form-section">
              <div className="form-section-title">
                <span>02</span>

                <h3>
                  Vehicle Details
                </h3>
              </div>

              <div className="booking-form-grid">
                <label>
                  Vehicle Number *

                  <input
                    type="text"
                    name="vehicleNumber"
                    value={
                      formData.vehicleNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. CAB 1234"
                    required
                  />
                </label>

                <label>
                  Vehicle Type

                  <select
                    name="vehicleType"
                    value={
                      formData.vehicleType
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select vehicle type
                    </option>

                    {vehicleTypes.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  Vehicle Make

                  <input
                    type="text"
                    name="vehicleMake"
                    value={
                      formData.vehicleMake
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Toyota"
                  />
                </label>

                <label>
                  Vehicle Model

                  <input
                    type="text"
                    name="vehicleModel"
                    value={
                      formData.vehicleModel
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Corolla"
                  />
                </label>
              </div>
            </section>

            <section className="booking-form-section">
              <div className="form-section-title">
                <span>03</span>

                <h3>
                  Choose Your Service
                </h3>
              </div>

              <div className="service-selection-grid">

                {loadingServices && (
                  <p>
                    Loading available services...
                  </p>
                )}

                {!loadingServices &&
                  services.map(
                    (
                      service,
                      index
                    ) => (
                      <button
                        type="button"
                        key={
                          service._id
                        }
                        className={`service-selection-card ${
                          formData.serviceType ===
                          service._id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          selectService(
                            service._id
                          )
                        }
                      >
                        <span className="service-selection-number">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="service-selection-copy">
                          <strong>
                            {
                              service.name
                            }
                          </strong>

                          <small>
                            {
                              service.description
                            }
                          </small>
                        </span>

                        <span className="service-selected-check">
                          ✓
                        </span>
                      </button>
                    )
                  )}
              </div>
            </section>

            <section className="booking-form-section">
              <div className="form-section-title">
                <span>04</span>

                <h3>
                  Choose Date & Time
                </h3>
              </div>

              <div className="booking-form-grid">
                <label>
                  Preferred Date *

                  <input
                    type="date"
                    name="date"
                    value={
                      formData.date
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </label>

                <label>
                  Preferred Time *

                  <select
                    name="time"
                    value={
                      formData.time
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="">
                      Select preferred time
                    </option>

                    {times.map(
                      (time) => (
                        <option
                          key={time}
                          value={time}
                        >
                          {time}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="full-width">
                  Additional Notes

                  <textarea
                    name="notes"
                    value={
                      formData.notes
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Tell us anything important about the vehicle or service request..."
                    rows="5"
                  />
                </label>
              </div>
            </section>

            <div className="booking-notice">
              <span>✓</span>

              <p>
                Your booking will initially
                be submitted with{" "}
                <strong>
                  Pending
                </strong>{" "}
                status. An administrator
                can then review and update
                the booking status.
              </p>
            </div>

            <button
              type="submit"
              className="submit-booking-button"
              disabled={
                submitting ||
                loadingServices
              }
            >
              {submitting
                ? "Submitting..."
                : "Submit Booking Request →"}
            </button>
          </form>

          <aside className="booking-sidebar">
            <div className="booking-summary-card">
              <span className="summary-eyebrow">
                BOOKING SUMMARY
              </span>

              <h2>
                Your service request.
              </h2>

              <div className="summary-list">
                <div>
                  <span>
                    Service
                  </span>

                  <strong>
                    {selectedService?.name ||
                      "Choose a service"}
                  </strong>
                </div>

                <div>
                  <span>
                    Vehicle
                  </span>

                  <strong>
                    {formData.vehicleNumber ||
                      "Add vehicle number"}
                  </strong>
                </div>

                <div>
                  <span>
                    Date
                  </span>

                  <strong>
                    {formData.date ||
                      "Select a date"}
                  </strong>
                </div>

                <div>
                  <span>
                    Time
                  </span>

                  <strong>
                    {formData.time ||
                      "Select a time"}
                  </strong>
                </div>

                <div>
                  <span>
                    Initial Status
                  </span>

                  <strong>
                    Pending
                  </strong>
                </div>
              </div>

              <div className="summary-next">
                <strong>
                  What happens next?
                </strong>

                <p>
                  After submitting your booking,
                  Carvix will create your service
                  request and provide a booking
                  reference that you can use to
                  track the appointment.
                </p>
              </div>
            </div>

            <div className="before-booking-card">
              <h3>
                Before you book
              </h3>

              <p>
                A few quick things to have ready.
              </p>

              <ul>
                <li>
                  <span>✓</span>
                  Your contact number
                </li>

                <li>
                  <span>✓</span>
                  Your vehicle registration number
                </li>

                <li>
                  <span>✓</span>
                  The service your vehicle needs
                </li>

                <li>
                  <span>✓</span>
                  Your preferred date and time
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="booking-features">
          <div className="booking-feature-card">
            <div className="booking-feature-icon">
              <FeatureIcon type="book" />
            </div>

            <div className="booking-feature-content">
              <span>
                BOOK ONLINE
              </span>

              <strong>
                Available anytime
              </strong>

              <p>
                Request your vehicle service whenever it suits you.
              </p>
            </div>
          </div>

          <div className="booking-feature-card">
            <div className="booking-feature-icon">
              <FeatureIcon type="track" />
            </div>

            <div className="booking-feature-content">
              <span>
                BOOKING STATUS
              </span>

              <strong>
                Track your request
              </strong>

              <p>
                Follow your booking from submission to completion.
              </p>
            </div>
          </div>

          <div className="booking-feature-card">
            <div className="booking-feature-icon">
              <FeatureIcon type="secure" />
            </div>

            <div className="booking-feature-content">
              <span>
                MANAGEMENT
              </span>

              <strong>
                Securely organized
              </strong>

              <p>
                Your booking details stay structured and protected.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BookService;