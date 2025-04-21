// db.js
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

let url = "mongodb+srv://akssmbr91:n1AVaMMpOv5SV5Lz@cluster0.vfcyhpk.mongodb.net/qnps_govind?retryWrites=true&w=majority"

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
