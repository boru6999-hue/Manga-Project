import { Router } from "express";
import {
  addFavourite,
  removeFavourite,
  getMyFavourites,
} from "../controllers/favourite.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/me", getMyFavourites);
router.post("/", addFavourite);
router.delete("/:mangaId", removeFavourite);

export default router;