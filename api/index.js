import app from "../server/src/app.js";
import { connectDatabase } from "../server/src/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Serverless database connection failed", error);
    return res.status(503).json({
      status: "error",
      data: null,
      error: {
        message: "Database connection unavailable",
        details: process.env.NODE_ENV === "development" ? error.message : null
      }
    });
  }
}
