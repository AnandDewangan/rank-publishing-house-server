import express from "express";
import upload from "../middleware/multer.js";
import { getBookImages, uploadImage, getImages, deleteImage } from "../controllers/imageController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getImages);
router.delete("/:id", deleteImage);
router.get("/cover-images", getBookImages);

export default router;
