import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import AdminSidebar from "../components/AdminSidebar";

import "./CustomerManagement.css";

function CustomerManagement() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [customerType, setCustomerType] =
    useState("All customers");

  const [bookingCount, setBookingCount] =
    useState("Any booking count");

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  function createInitials(name) {
    if (!name) {
      return "CU";
    }

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  }

  function formatShortDate(dateValue) {
    if (!dateValue) {
      return "Unknown";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
      }
    );
  }

  function groupBookingsIntoCustomers(
    bookings
  ) {
    const customerMap = new Map();

    bookings.forEach((booking) => {
      const phone =
        booking.phone?.trim() ||
        "Unknown";

      if (!customerMap.has(phone)) {
        customerMap.set(phone, {
          initials: createInitials(
            booking.customerName
          ),

          name:
            booking.customerName ||
            "Unknown Customer",

          phone,

          vehicles: new Set(),

          bookings: [],

          latestBooking: null,
        });
      }

      const customer =
        customerMap.get(phone);

      if (booking.vehicleNumber) {
        customer.vehicles.add(
          booking.vehicleNumber
        );
      }

      customer.bookings.push(booking);

      if (
        !customer.latestBooking ||
        new Date(
          booking.createdAt
        ) >
          new Date(
            customer.latestBooking.createdAt
          )
      ) {
        customer.latestBooking =
          booking;
      }
    });

    return Array.from(
      customerMap.values()
    )
      .map((customer) => {
        const latest =
          customer.latestBooking;

        const primaryVehicle =
          latest?.vehicleNumber ||
          Array.from(
            customer.vehicles
          )[0] ||
          "Not available";

        const lastService =
          latest?.serviceType
            ? `${
                latest.serviceType
              } · ${formatShortDate(
                latest.date
              )}`
            : "Not available";

        return {
          initials:
            customer.initials,

          name:
            customer.name,

          phone:
            customer.phone,

          vehicle:
            primaryVehicle,

          bookings:
            customer.bookings.length,

          lastService,

          type:
            customer.bookings.length > 1
              ? "Returning"
              : "New",

          vehicles:
            Array.from(
              customer.vehicles
            ),
        };
      })
      .sort(
        (a, b) =>
          b.bookings -
          a.bookings
      );
  }

  async function loadCustomers() {
    try {
      setLoading(true);

      const response =
        await api.get("/bookings");

      const groupedCustomers =
        groupBookingsIntoCustomers(
          response.data
        );

      setCustomers(
        groupedCustomers
      );
    } catch (error) {
      console.error(
        "Failed to load customers:",
        error
      );

      alert(
        "Unable to load customer data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers =
    useMemo(() => {
      return customers.filter(
        (customer) => {
          const query =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !query ||
            customer.name
              .toLowerCase()
              .includes(query) ||
            customer.phone
              .toLowerCase()
              .includes(query) ||
            customer.vehicle
              .toLowerCase()
              .includes(query);

          const matchesType =
            customerType ===
              "All customers" ||
            customer.type ===
              customerType;

          let matchesBookingCount =
            true;

          if (
            bookingCount ===
            "1 booking"
          ) {
            matchesBookingCount =
              customer.bookings === 1;
          } else if (
            bookingCount ===
            "2+ bookings"
          ) {
            matchesBookingCount =
              customer.bookings >= 2;
          } else if (
            bookingCount ===
            "3+ bookings"
          ) {
            matchesBookingCount =
              customer.bookings >= 3;
          }

          return (
            matchesSearch &&
            matchesType &&
            matchesBookingCount
          );
        }
      );
    }, [
      search,
      customerType,
      bookingCount,
      customers,
    ]);

  const returningCustomers =
    customers.filter(
      (customer) =>
        customer.bookings > 1
    ).length;

  const uniqueVehicles =
    useMemo(() => {
      const vehicleSet =
        new Set();

      customers.forEach(
        (customer) => {
          customer.vehicles.forEach(
            (vehicle) =>
              vehicleSet.add(vehicle)
          );
        }
      );

      return vehicleSet.size;
    }, [customers]);

  const repeatBookingRate =
    customers.length > 0
      ? Math.round(
          (returningCustomers /
            customers.length) *
            100
        )
      : 0;

  const topCustomers =
    customers.slice(0, 3);

  function clearFilters() {
    setSearch("");

    setCustomerType(
      "All customers"
    );

    setBookingCount(
      "Any booking count"
    );
  }

  return (
    <div className="customer-management-page">
      <AdminSidebar />

      <div className="customer-management-content">

        {/* HEADER */}
        <header className="customer-admin-header">
          <div>
            <span>
              ADMINISTRATION
            </span>

            <strong>
              Customer Management
            </strong>
          </div>

          <div className="customer-admin-header-actions">
            <button
              type="button"
              className="customer-refresh-button"
              aria-label="Refresh customers"
              onClick={loadCustomers}
              disabled={loading}
            >
              ↻
            </button>

            <button
              type="button"
              className="customer-dashboard-button"
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

        <main className="customer-management-main">

          {/* INTRO */}
          <section className="customer-management-intro">
            <div>
              <span>
                CUSTOMER INSIGHTS
              </span>

              <h1>
                Know the people behind every booking.
              </h1>

              <p>
                Review customer activity using
                the booking records already
                stored in Carvix. See contact
                details, vehicles, booking
                history, returning customers,
                and recent service activity in
                one place.
              </p>
            </div>

            <div className="customer-count-pill">
              {customers.length} unique customers
            </div>
          </section>

          {/* STATS */}
          <section className="customer-stat-grid">

            <div className="customer-stat-card">
              <div className="customer-stat-top">
                <span>
                  Total Customers
                </span>

                <div>◯</div>
              </div>

              <strong>
                {customers.length}
              </strong>

              <small>
                Unique customers from booking data
              </small>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-top">
                <span>
                  Returning Customers
                </span>

                <div>↶</div>
              </div>

              <strong>
                {returningCustomers}
              </strong>

              <small>
                Customers with more than one booking
              </small>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-top">
                <span>
                  Vehicles Served
                </span>

                <div>▣</div>
              </div>

              <strong>
                {uniqueVehicles}
              </strong>

              <small>
                Vehicles linked to customer bookings
              </small>
            </div>

            <div className="customer-stat-card">
              <div className="customer-stat-top">
                <span>
                  Repeat Booking Rate
                </span>

                <div>↻</div>
              </div>

              <strong>
                {repeatBookingRate}%
              </strong>

              <small>
                Customers who booked again
              </small>
            </div>
          </section>

          {/* MAIN GRID */}
          <section className="customer-management-grid">

            {/* DIRECTORY */}
            <div className="customer-directory-card">

              <div className="customer-directory-heading">
                <div>
                  <h2>
                    Customer directory
                  </h2>

                  <p>
                    Customers are grouped
                    from the booking records
                    stored in Carvix.
                  </p>
                </div>

                <div className="customer-directory-counts">
                  <span>
                    {
                      filteredCustomers.length
                    }{" "}
                    visible
                  </span>

                  <span>
                    {
                      customers.length
                    }{" "}
                    total
                  </span>
                </div>
              </div>

              {/* FILTERS */}
              <div className="customer-directory-filters">
                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search name, phone, vehicle..."
                />

                <select
                  value={customerType}
                  onChange={(event) =>
                    setCustomerType(
                      event.target.value
                    )
                  }
                >
                  <option>
                    All customers
                  </option>

                  <option>
                    Returning
                  </option>

                  <option>
                    New
                  </option>
                </select>

                <select
                  value={bookingCount}
                  onChange={(event) =>
                    setBookingCount(
                      event.target.value
                    )
                  }
                >
                  <option>
                    Any booking count
                  </option>

                  <option>
                    1 booking
                  </option>

                  <option>
                    2+ bookings
                  </option>

                  <option>
                    3+ bookings
                  </option>
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>

              {/* TABLE */}
              <div className="customer-table-wrapper">
                <table className="customer-directory-table">
                  <thead>
                    <tr>
                      <th>
                        CUSTOMER
                      </th>

                      <th>
                        PRIMARY VEHICLE
                      </th>

                      <th>
                        BOOKINGS
                      </th>

                      <th>
                        LAST SERVICE
                      </th>

                      <th>
                        CUSTOMER TYPE
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.map(
                      (customer) => (
                        <tr
                          key={
                            customer.phone
                          }
                        >
                          <td>
                            <div className="customer-name-cell">
                              <div className="customer-avatar">
                                {
                                  customer.initials
                                }
                              </div>

                              <div>
                                <strong>
                                  {
                                    customer.name
                                  }
                                </strong>

                                <small>
                                  {
                                    customer.phone
                                  }
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            {
                              customer.vehicle
                            }
                          </td>

                          <td>
                            {
                              customer.bookings
                            }
                          </td>

                          <td>
                            {
                              customer.lastService
                            }
                          </td>

                          <td>
                            <span
                              className={`customer-type-badge ${customer.type.toLowerCase()}`}
                            >
                              {
                                customer.type
                              }
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {loading && (
                  <div className="customer-empty-state">
                    Loading customer data...
                  </div>
                )}

                {!loading &&
                  filteredCustomers.length ===
                    0 && (
                    <div className="customer-empty-state">
                      No customers match
                      your filters.
                    </div>
                  )}
              </div>

              <div className="customer-directory-footer">
                <span>
                  Showing{" "}
                  {filteredCustomers.length >
                  0
                    ? `1–${filteredCustomers.length}`
                    : "0"}{" "}
                  of {customers.length}{" "}
                  customers
                </span>

                <div className="customer-pagination">
                  <button className="active">
                    1
                  </button>
                </div>
              </div>
            </div>

            {/* INSIGHTS */}
            <aside className="customer-insights-card">
              <div className="customer-insights-heading">
                <h2>
                  Customer insights
                </h2>

                <p>
                  A quick view of customer
                  activity from booking history.
                </p>
              </div>

              <div className="customer-highlight-card">
                <span>
                  CARVIX RELATIONSHIPS
                </span>

                <h3>
                  Repeat customers are your strongest signal.
                </h3>

                <p>
                  Use booking history to
                  understand frequent visitors,
                  service patterns, and
                  customers who return with
                  the same vehicle.
                </p>
              </div>

              <div className="top-customer-list">
                {topCustomers.map(
                  (customer, index) => (
                    <div
                      className="top-customer-row"
                      key={
                        customer.phone
                      }
                    >
                      <div className="top-customer-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="top-customer-copy">
                        <strong>
                          {
                            customer.name
                          }
                        </strong>

                        <span>
                          {
                            customer.bookings
                          }{" "}
                          total{" "}
                          {customer.bookings ===
                          1
                            ? "booking"
                            : "bookings"}
                        </span>
                      </div>

                      <small>
                        {index === 0
                          ? "Top"
                          : "Repeat"}
                      </small>
                    </div>
                  )
                )}
              </div>

              <div className="customer-srs-note">
                <strong>
                  How this page works
                </strong>

                <p>
                  The original SRS does not
                  require a separate Customer
                  collection. This page is
                  generated by grouping booking
                  records using customer phone
                  numbers and vehicle details,
                  which keeps it aligned with
                  the project scope.
                </p>
              </div>
            </aside>
          </section>

          <footer className="customer-admin-footer">
            © 2026 Carvix · Vehicle
            Service Booking & Management
            System · Admin Portal
          </footer>
        </main>
      </div>
    </div>
  );
}

export default CustomerManagement;