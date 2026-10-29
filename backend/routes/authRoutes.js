const express = require("express");

const {
  loginAdmin,
  changeAdminPassword,
} = require("../controllers/authController");

const {
  protectAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC - admin login
router.post("/login", loginAdmin);

// ADMIN ONLY - change password
router.put(
  "/change-password",
  protectAdmin,
  changeAdminPassword
);

module.exports = router;