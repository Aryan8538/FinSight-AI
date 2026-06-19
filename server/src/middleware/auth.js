import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError, asyncHandler } from "../utils/http.js";
import User from "../models/User.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new AppError(401, "Authentication required");

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

