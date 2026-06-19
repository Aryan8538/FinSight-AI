import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { AppError, asyncHandler, ok } from "../utils/http.js";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(100)
});

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1)
});

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

function serialize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profile: user.profile,
    watchlist: user.watchlist,
    badges: user.badges,
    createdAt: user.createdAt
  };
}

export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  return ok(res, { token: signToken(user), user: serialize(user) }, 201);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError(401, "Incorrect email or password");
  }
  return ok(res, { token: signToken(user), user: serialize(user) });
});

export const me = asyncHandler(async (req, res) => ok(res, { user: serialize(req.user) }));

export const updateProfile = asyncHandler(async (req, res) => {
  Object.assign(req.user.profile, req.body);
  await req.user.save();
  return ok(res, { user: serialize(req.user) });
});

