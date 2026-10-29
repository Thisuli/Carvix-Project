const Booking = require("../models/Booking");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      vehicleNumber,
      serviceType,
      date,
      time,
    } = req.body;

    const booking = await Booking.create({
      customerName,
      phone,
      vehicleNumber,
      serviceType,
      date,
      time,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// GET ALL BOOKINGS
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get bookings",
      error: error.message,
    });
  }
};

// GET ONE BOOKING BY ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get booking",
      error: error.message,
    });
  }
};

// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Completed",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

// DELETE BOOKING
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};

// TRACK BOOKING BY REFERENCE
const trackBookingByReference = async (req, res) => {
  try {
    const reference = req.params.reference
      .trim()
      .toUpperCase();

    const bookings = await Booking.find();

    const booking = bookings.find((item) => {
      const year = item.createdAt
        ? new Date(item.createdAt).getFullYear()
        : new Date().getFullYear();

      const shortId = item._id
        .toString()
        .slice(-6)
        .toUpperCase();

      const bookingReference =
        `CVX-${year}-${shortId}`;

      return bookingReference === reference;
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to track booking",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  trackBookingByReference,
};