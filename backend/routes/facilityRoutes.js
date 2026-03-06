const express = require("express");
const router = express.Router();
const { getAllFacilities, getFacilityBySlug } = require("../controllers/facilityController");

router.get("/", getAllFacilities);
router.get("/:slug", getFacilityBySlug);

module.exports = router;