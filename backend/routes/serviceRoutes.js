const express = require("express");

const {
  getServices,
  createService,
} = require("../controllers/serviceController");

const {
  protectAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC - customers can view available services
router.get("/", getServices);

// ADMIN ONLY - create a new service category
router.post("/", protectAdmin, createService);

module.exports = router;