import { Router } from "express";
import { getModule, listModules, submitQuiz } from "../controllers/learningController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/", listModules);
router.get("/:slug", getModule);
router.post("/:slug/quiz", submitQuiz);
export default router;

