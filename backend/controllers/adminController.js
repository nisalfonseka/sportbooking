const Booking = require("../models/Booking");
const User = require("../models/User");
const Facility = require("../models/Facility");

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status.toUpperCase();
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name email")
      .populate("facilityId", "name slug")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Approve booking
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({ message: "Only PENDING bookings can be approved" });
    }

    // Re-check overlap at approval time
    const overlap = await Booking.findOne({
      _id: { $ne: booking._id },
      facilityId: booking.facilityId,
      status: "APPROVED",
      startTime: { $lt: booking.endTime },
      endTime: { $gt: booking.startTime },
    });

    if (overlap) {
      return res.status(409).json({
        message: "Cannot approve: time slot overlaps with an existing approved booking",
      });
    }

    booking.status = "APPROVED";
    booking.approvedBy = req.user.id;
    booking.approvedAt = new Date();
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("userId", "name email")
      .populate("facilityId", "name slug")
      .populate("approvedBy", "name email");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reject booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({ message: "Only PENDING bookings can be rejected" });
    }

    booking.status = "REJECTED";
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("userId", "name email")
      .populate("facilityId", "name slug");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};