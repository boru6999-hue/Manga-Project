import express from "express";
import {
  addFavourite,
  removeFavourite,
  getUserFavourites,
} from "../controllers/favourite.controller.js";

const router = express.Router();

router.post("/", addFavourite);
router.delete("/", removeFavourite);
router.get("/:userId", getUserFavourites);

export default router;
