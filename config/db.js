// config/db.js
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://akssmbr91:n1AVaMMpOv5SV5Lz@cluster0.vfcyhpk.mongodb.net/qnps_govind?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
