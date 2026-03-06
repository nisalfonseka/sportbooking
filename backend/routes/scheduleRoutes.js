const express = require("express");
const router = express.Router();
const { getSchedule } = require("../controllers/scheduleController");

// Public route - no auth needed
router.get("/:slug", getSchedule);

module.exports = router;