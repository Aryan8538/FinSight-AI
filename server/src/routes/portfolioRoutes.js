import { Router } from "express";
import {
  addHolding,
  create,
  createPortfolioSchema,
  exportCsv,
  getOne,
  holdingSchema,
  list,
  remove,
  removeHolding,
  updateHolding
} from "../controllers/portfolioController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../utils/validation.js";

const router = Router();
router.use(requireAuth);
router.route("/").get(list).post(validate(createPortfolioSchema), create);
router.get("/:id/export", exportCsv);
router.route("/:id").get(getOne).delete(remove);
router.post("/:id/holdings", validate(holdingSchema), addHolding);
router.patch("/:id/holdings/:holdingId", validate(holdingSchema), updateHolding);
router.delete("/:id/holdings/:holdingId", removeHolding);
export default router;

