import express from "express";
import upload from "../middleware/multer.js"; // uses memoryStorage
import {
  createArticle,
  deleteArticle,
  getArticles,
} from "../controllers/articleController.js";

const router = express.Router();

router.get("/", getArticles);
router.post("/", upload.single("image"), createArticle); // Uses memoryStorage
router.delete("/:id", deleteArticle);

export default router;
