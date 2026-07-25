import mongoose from "mongoose";

const connectDB = async (url) => {
  if (!url) {
    throw new Error("MongoDB connection URL is required (BASE_URL)");
  }

  // Reuse connection across serverless invocations (Vercel)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(url);
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
};

export default connectDB;
