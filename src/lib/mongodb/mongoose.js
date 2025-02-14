import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "your-mongodb-uri-here";

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
    console.log("Connected to MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
})();
