const express = require("express");

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  trackBookingByReference,
} = require("../controllers/bookingController");

const {
  protectAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC - customer creates booking
router.post("/", createBooking);

// PUBLIC - customer tracks one booking by reference
router.get(
  "/track/:reference",
  trackBookingByReference
);

// ADMIN ONLY - get all bookings
router.get(
  "/",
  protectAdmin,
  getBookings
);

// ADMIN ONLY - get one booking by ID
router.get(
  "/:id",
  protectAdmin,
  getBookingById
);

// ADMIN ONLY - update booking status
router.put(
  "/:id/status",
  protectAdmin,
  updateBookingStatus
);

// ADMIN ONLY - delete booking
router.delete(
  "/:id",
  protectAdmin,
  deleteBooking
);

module.exports = router;