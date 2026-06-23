import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError, asyncHandler } from "../utils/http.js";
import User from "../models/User.js";

async function getDemoUser() {
  const existingUser = await User.findOne({ email: "demo@finsight.ai" }).select("-password");
  if (existingUser) return existingUser;

  const createdUser = await User.create({
    name: "Demo Student",
    email: "demo@finsight.ai",
    password: "DemoPassword2026",
    profile: {
      school: "FinSight Demo",
      experience: "beginner",
      riskTolerance: "balanced",
      goals: ["Learn investing", "Build a paper portfolio", "Understand budgeting"]
    },
    watchlist: ["AAPL", "MSFT", "NVDA"],
    badges: []
  });

  return User.findById(createdUser._id).select("-password");
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    req.user = await getDemoUser();
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("-password");
    if (!user) throw new AppError(401, "User no longer exists");
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(401, "Invalid or expired token");
  }
});
