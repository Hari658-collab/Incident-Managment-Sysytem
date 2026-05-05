const mongoose = require("mongoose");

async function connectMongo() {
  try {
    await mongoose.connect(
      process.env.MONGO_URL || "mongodb://mongo:27017/ims"
    );

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
}

module.exports = connectMongo;