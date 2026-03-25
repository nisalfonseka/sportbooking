const mongoose = require("mongoose");
const Facility = require("../models/Facility");

const facilities = [
  {
    name: "Futsal / Football Ground",
    slug: "futsal-football",
    openTime: "06:00",
    closeTime: "22:00",
  },
  {
    name: "Badminton Court",
    slug: "badminton",
    openTime: "07:00",
    closeTime: "21:00",
  },
  {
    name: "Swimming Pool",
    slug: "swimming-pool",
    openTime: "05:00",
    closeTime: "20:00",
  },
];

const seedFacilities = async () => {
  try {
    const count = await Facility.countDocuments();
    if (count === 0) {
      await Facility.insertMany(facilities);
      console.log("Facilities seeded");
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
};

module.exports = seedFacilities;