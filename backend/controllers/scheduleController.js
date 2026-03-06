const Booking = require("../models/Booking");
const Facility = require("../models/Facility");

exports.getSchedule = async (req, res) => {
  try {
    const facility = await Facility.findOne({ slug: req.params.slug });
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const filter = {
      facilityId: facility._id,
      status: "APPROVED",
    };

    // Optional date filter
    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.startTime = { $gte: date, $lt: nextDay };
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name")
      .populate("facilityId", "name slug openTime closeTime")
      .sort({ startTime: 1 });

    res.json({ facility, bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};