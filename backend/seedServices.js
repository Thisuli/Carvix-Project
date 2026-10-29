const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

const Service = require("./models/Service");

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const services = [
  {
    name: "Oil Change",
    description:
      "Professional engine oil and oil-filter replacement service.",
    type: "oil",
  },
  {
    name: "Full Vehicle Service",
    description:
      "Comprehensive vehicle inspection and routine maintenance service.",
    type: "vehicle",
  },
  {
    name: "Brake Inspection",
    description:
      "Brake system inspection and safety-condition assessment.",
    type: "brake",
  },
  {
    name: "Engine Diagnostics",
    description:
      "Diagnostic checks for warning lights, faults, and engine-performance issues.",
    type: "engine",
  },
  {
    name: "Battery Service",
    description:
      "Battery testing, inspection, and replacement support.",
    type: "battery",
  },
  {
    name: "Tyre Service",
    description:
      "Tyre inspection and maintenance support for safety and performance.",
    type: "tyre",
  },
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    for (const service of services) {
      const existingService =
        await Service.findOne({
          name: service.name,
        });

      if (!existingService) {
        await Service.create(service);

        console.log(
          `Created: ${service.name}`
        );
      } else {
        console.log(
          `Already exists: ${service.name}`
        );
      }
    }

    console.log(
      "Service categories seeded successfully"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to seed services:",
      error.message
    );

    process.exit(1);
  }
}

seedServices();