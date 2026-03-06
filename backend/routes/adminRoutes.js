const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllBookings,
  approveBooking,
  rejectBooking,
  getAllUsers,
} = require("../controllers/adminController");

router.use(authMiddleware, adminMiddleware);

router.get("/bookings", getAllBookings);
router.patch("/bookings/:id/approve", approveBooking);
router.patch("/bookings/:id/reject", rejectBooking);
router.get("/users", getAllUsers);

module.exports = router;