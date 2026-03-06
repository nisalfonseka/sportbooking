const Booking = require("../models/Booking");
const Facility = require("../models/Facility");

// Helper: parse "HH:MM" to minutes since midnight
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Helper: get HH:MM from a Date object
function getTimeFromDate(date) {
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Create a booking request
exports.createBooking = async (req, res) => {
  try {
    const { facilityId, startTime, endTime } = req.body;

    if (!facilityId || !startTime || !endTime) {
      return res.status(400).json({ message: "facilityId, startTime, and endTime are required" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validate end > start
    if (end <= start) {
      return res.status(400).json({ message: "End time must be later than start time" });
    }

    // Validate facility exists
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    // Validate within opening hours
    const startMinutes = timeToMinutes(getTimeFromDate(start));
    const endMinutes = timeToMinutes(getTimeFromDate(end));
    const openMinutes = timeToMinutes(facility.openTime);
    const closeMinutes = timeToMinutes(facility.closeTime);

    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      return res.status(400).json({
        message: `Booking must be within facility hours: ${facility.openTime} - ${facility.closeTime}`,
      });
    }

    // Check overlap with APPROVED bookings
    const overlap = await Booking.findOne({
      facilityId,
      status: "APPROVED",
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (overlap) {
      return res.status(409).json({ message: "Time slot overlaps with an existing approved booking" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      facilityId,
      startTime: start,
      endTime: end,
      status: "PENDING",
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get current user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("facilityId", "name slug")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cancel own booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};