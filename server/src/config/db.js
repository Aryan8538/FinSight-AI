import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  mongoose.set("strictQuery", true);
  
  const isProduction = env.nodeEnv === "production" || process.env.NODE_ENV === "production";
  if (isProduction && (!env.mongoUri || env.mongoUri.includes("127.0.0.1") || env.mongoUri.includes("localhost"))) {
    throw new Error("MONGODB_URI is not configured for production or is pointing to localhost!");
  }

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

