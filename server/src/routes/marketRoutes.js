import { Router } from "express";
import { addWatchlist, history, quote, removeWatchlist, search, watchlist } from "../controllers/marketController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/search", search);
router.get("/quote/:symbol", quote);
router.get("/history/:symbol", history);
router.get("/watchlist", watchlist);
router.post("/watchlist/:symbol", addWatchlist);
router.delete("/watchlist/:symbol", removeWatchlist);
export default router;

