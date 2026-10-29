const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "vehicle",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model(
  "Service",
  serviceSchema
);

module.exports = Service;