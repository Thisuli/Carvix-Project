const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const dns = require("dns");

const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

dotenv.config();

/* Fix MongoDB Atlas SRV DNS lookup on Windows */
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Test Route */
app.get("/", (req, res) => {
  res.send("Carvix backend is running");
});

/* API Routes */
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);

/* MongoDB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Carvix server running on port ${PORT}`
  );
});