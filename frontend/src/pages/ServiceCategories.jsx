import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import AdminSidebar from "../components/AdminSidebar";

import "./ServiceCategories.css";

function ServiceIcon({ type }) {
  if (type === "oil") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 4h8" />
        <path d="M9 4v3h6V4" />
        <path d="M7 7h10v13H7z" />
        <path d="M5 10h2M17 10h2" />
        <path d="M12 10v7" />
      </svg>
    );
  }

  if (type === "vehicle") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 14l2-5h10l2 5" />
        <path d="M4 14h16v4H4z" />
        <circle cx="7" cy="18" r="1.4" />
        <circle cx="17" cy="18" r="1.4" />
      </svg>
    );
  }

  if (type === "brake") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="7" />
        <path d="M12 5v7l5 3" />
      </svg>
    );
  }

  if (type === "engine") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 9h10l2 3v6H5v-6l2-3Z" />
        <path d="M9 9V6h6v3" />
        <path d="M8 18v2M16 18v2" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    );
  }

  if (type === "battery") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect
          x="5"
          y="8"
          width="14"
          height="10"
          rx="2"
        />

        <path d="M8 5v3M16 5v3" />
        <path d="M9 13h3M10.5 11.5v3" />
        <path d="M14 13h2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 5v3M12 16v3M5 12h3M16 12h3" />
    </svg>
  );
}

function ServiceCategories() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  async function loadServices() {
    try {
      setLoading(true);

      const response =
        await api.get("/services");

      setServices(response.data);
    } catch (error) {
      console.error(
        "Failed to load service categories:",
        error
      );

      alert(
        "Unable to load service categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return services;
    }

    return services.filter(
      (service) =>
        service.name
          .toLowerCase()
          .includes(query) ||
        service.description
          .toLowerCase()
          .includes(query)
    );
  }, [search, services]);

  function handleInputChange(event) {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleAddCategory(event) {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim()
    ) {
      alert(
        "Please enter both the category name and description."
      );

      return;
    }

    try {
      setSubmitting(true);

      await api.post("/services", {
        name: formData.name.trim(),
        description:
          formData.description.trim(),
        type: "vehicle",
      });

      setFormData({
        name: "",
        description: "",
      });

      await loadServices();
    } catch (error) {
      console.error(
        "Failed to create service category:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to create service category.";

      alert(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="service-categories-page">
      <AdminSidebar />

      <div className="service-categories-content">

        {/* HEADER */}
        <header className="service-category-header">
          <div>
            <span>
              ADMINISTRATION
            </span>

            <strong>
              Service Category Management
            </strong>
          </div>

          <div className="service-category-header-actions">
            <button
              type="button"
              className="service-category-refresh"
              aria-label="Refresh service categories"
              onClick={loadServices}
              disabled={loading}
            >
              ↻
            </button>

            <button
              type="button"
              className="service-category-dashboard-button"
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

        <main className="service-category-main">

          {/* INTRO */}
          <section className="service-category-intro">
            <div>
              <span>
                SERVICE MANAGEMENT
              </span>

              <h1>
                Manage your service categories.
              </h1>

              <p>
                Maintain the service types
                available for Carvix
                vehicle-service bookings.
                Add clear category names and
                descriptions so customers
                can select the correct service.
              </p>
            </div>

            <div className="category-count-pill">
              {services.length} categories
            </div>
          </section>

          {/* SUMMARY */}
          <section className="service-category-summary-grid">
            <div className="service-category-summary-card">
              <div className="service-summary-top">
                <span>
                  Total Categories
                </span>

                <div>≡</div>
              </div>

              <strong>
                {services.length}
              </strong>

              <small>
                Services currently listed
              </small>
            </div>

            <div className="service-category-summary-card">
              <div className="service-summary-top">
                <span>
                  Customer Booking
                </span>

                <div>▣</div>
              </div>

              <strong>
                Linked
              </strong>

              <small>
                Categories feed the booking form
              </small>
            </div>

            <div className="service-category-summary-card">
              <div className="service-summary-top">
                <span>
                  Management
                </span>

                <div>✎</div>
              </div>

              <strong>
                Admin
              </strong>

              <small>
                Protected administrator workspace
              </small>
            </div>
          </section>

          {/* MAIN GRID */}
          <section className="service-category-workspace">

            {/* LEFT LIST */}
            <div className="service-category-list-card">
              <div className="service-category-card-heading">
                <div>
                  <h2>
                    Service category list
                  </h2>

                  <p>
                    All service types
                    currently available in
                    the Carvix system.
                  </p>
                </div>

                <span className="api-pill">
                  GET /api/services
                </span>
              </div>

              <div className="service-category-search">
                <input
                  type="text"
                  placeholder="Search service categories..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  Clear
                </button>
              </div>

              <div className="service-category-list">

                {loading && (
                  <div className="service-category-empty">
                    Loading service categories...
                  </div>
                )}

                {!loading &&
                  filteredServices.map(
                    (service, index) => (
                      <div
                        className="service-category-row"
                        key={service._id}
                      >
                        <div className="service-category-row-icon">
                          <ServiceIcon
                            type={
                              service.type
                            }
                          />
                        </div>

                        <div className="service-category-row-copy">
                          <strong>
                            {
                              service.name
                            }
                          </strong>

                          <p>
                            {
                              service.description
                            }
                          </p>
                        </div>

                        <span className="service-category-number">
                          SERVICE{" "}
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>
                      </div>
                    )
                  )}

                {!loading &&
                  filteredServices.length ===
                    0 && (
                    <div className="service-category-empty">
                      No service categories
                      match your search.
                    </div>
                  )}
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="add-service-category-card">
              <div className="service-category-card-heading">
                <div>
                  <h2>
                    Add new category
                  </h2>

                  <p>
                    Create a new service
                    type for customer
                    bookings.
                  </p>
                </div>

                <span className="api-pill">
                  POST /api/services
                </span>
              </div>

              <form
                className="add-category-form"
                onSubmit={
                  handleAddCategory
                }
              >
                <div className="category-form-info">
                  <h3>
                    Service category details
                  </h3>

                  <p>
                    The SRS category model
                    uses a service name and
                    description. Keep both
                    clear and
                    customer-friendly.
                  </p>
                </div>

                <label>
                  Category Name *

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="e.g. Air Conditioning Service"
                    required
                  />

                  <small>
                    Use a short,
                    recognizable service name.
                  </small>
                </label>

                <label>
                  Description *

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleInputChange
                    }
                    rows="6"
                    placeholder="Briefly describe what this service includes..."
                    required
                  />

                  <small>
                    Explain the service
                    clearly for customers.
                  </small>
                </label>

                <button
                  type="submit"
                  className="add-service-category-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Adding..."
                    : "+ Add Service Category"}
                </button>

                <div className="service-implementation-note">
                  <strong>
                    Implementation note
                  </strong>

                  <p>
                    This form now submits
                    the category directly to
                    the service-category API
                    and refreshes the list
                    from MongoDB.
                  </p>
                </div>
              </form>
            </div>
          </section>

          <footer className="service-category-footer">
            © 2026 Carvix · Vehicle
            Service Booking & Management
            System · Admin Portal
          </footer>
        </main>
      </div>
    </div>
  );
}

export default ServiceCategories;