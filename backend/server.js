require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const seedFacilities = require("./config/seed");

// Routes
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();

/* -----------------------------
   CONNECT DATABASE & SEED
------------------------------*/
connectDB().then(() => {
  seedFacilities();
});

/* -----------------------------
   MIDDLEWARE
------------------------------*/
app.use(cors());
app.use(express.json());

/* -----------------------------
   ROUTES
------------------------------*/
app.get("/", (req, res) => {
  res.json({ message: "Sports Complex Booking API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/schedule", scheduleRoutes);

/* -----------------------------
   ERROR HANDLER
------------------------------*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

/* -----------------------------
   SERVER START
------------------------------*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});