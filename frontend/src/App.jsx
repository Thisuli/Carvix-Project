import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BookService from "./pages/BookService";
import BookingConfirmation from "./pages/BookingConfirmation";
import TrackBooking from "./pages/TrackBooking";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import BookingManagement from "./pages/BookingManagement";
import ServiceCategories from "./pages/ServiceCategories";
import CustomerManagement from "./pages/CustomerManagement";
import Settings from "./pages/Settings";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />

        <Route
          path="/book-service"
          element={<BookService />}
        />

        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />

        <Route
          path="/track-booking"
          element={<TrackBooking />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedAdminRoute>
              <BookingManagement />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/service-categories"
          element={
            <ProtectedAdminRoute>
              <ServiceCategories />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <ProtectedAdminRoute>
              <CustomerManagement />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedAdminRoute>
              <Settings />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;