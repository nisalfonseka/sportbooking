const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  name: String,
  slug: String,
  openTime: String,
  closeTime: String
});

module.exports = mongoose.model("Facility", facilitySchema);