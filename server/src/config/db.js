import mongoose from "mongoose";
import { env } from "./env.js";

let connectionPromise;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  mongoose.set("strictQuery", true);
  connectionPromise = mongoose.connect(env.mongoUri).catch((error) => {
    connectionPromise = null;
    throw error;
  });
  await connectionPromise;
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  return mongoose.connection;
}
