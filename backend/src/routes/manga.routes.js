import express from "express";
import {
  getMangaList,
  getMangaById,
  createManga,
  updateManga,
  deleteManga,
} from "../controllers/manga.controller.js";

const router = express.Router();

router.get("/", getMangaList);
router.get("/:id", getMangaById);
router.post("/", createManga);
router.put("/:id", updateManga);
router.delete("/:id", deleteManga);

export default router;
