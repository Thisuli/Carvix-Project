const Service = require("../models/Service");

// GET ALL SERVICES
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({
      createdAt: 1,
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get services",
      error: error.message,
    });
  }
};

// CREATE SERVICE
const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
    } = req.body;

    if (
      !name?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        message:
          "Service name and description are required",
      });
    }

    const existingService =
      await Service.findOne({
        name: name.trim(),
      });

    if (existingService) {
      return res.status(409).json({
        message:
          "A service with this name already exists",
      });
    }

    const service = await Service.create({
      name: name.trim(),
      description: description.trim(),
      type: type?.trim() || "vehicle",
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create service",
      error: error.message,
    });
  }
};

module.exports = {
  getServices,
  createService,
};