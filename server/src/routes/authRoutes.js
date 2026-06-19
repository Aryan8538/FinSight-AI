import { Router } from "express";
import { z } from "zod";
import { login, loginSchema, me, register, registerSchema, updateProfile } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../utils/validation.js";

const router = Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);
router.patch(
  "/profile",
  requireAuth,
  validate(
    z.object({
      school: z.string().trim().max(120).optional(),
      experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      riskTolerance: z.enum(["conservative", "balanced", "growth"]).optional(),
      goals: z.array(z.string().trim().min(1).max(80)).max(8).optional()
    })
  ),
  updateProfile
);
export default router;

