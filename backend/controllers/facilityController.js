const Facility = require("../models/Facility");

exports.getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ name: 1 });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getFacilityBySlug = async (req, res) => {
  try {
    const facility = await Facility.findOne({ slug: req.params.slug });
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.json(facility);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};