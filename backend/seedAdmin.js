const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const dns = require("dns");

const Admin = require("./models/Admin");

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.log(
        "ADMIN_USERNAME and ADMIN_PASSWORD are missing from .env"
      );

      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({
      username,
    });

    if (existingAdmin) {
      console.log("Admin account already exists");

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await Admin.create({
      username,
      password: hashedPassword,
    });

    console.log(
      "Admin account created successfully"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to create admin:",
      error.message
    );

    process.exit(1);
  }
}

createAdmin();