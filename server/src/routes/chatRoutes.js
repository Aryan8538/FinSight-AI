import { Router } from "express";
import { getSession, listSessions, removeSession, sendMessage } from "../controllers/chatController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/sessions", listSessions);
router.get("/sessions/:id", getSession);
router.delete("/sessions/:id", removeSession);
router.post("/messages", sendMessage);
export default router;

