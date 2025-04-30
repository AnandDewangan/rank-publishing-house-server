import express from "express";
import upload from "../middleware/multer.js";
import { uploadAuthorImage } from "../utils/cloudinary.js";
import { verifyAuthor } from "../middleware/auth.js";
import { authorLogin, getAuthorProfile, updateAuthor, getAuthorById, getAuthors, createAuthor, deleteAuthor } from "../controllers/authorController.js"; 

const router = express.Router();

router.post("/login", authorLogin);
router.get("/profile", verifyAuthor, getAuthorProfile);
router.get("/", getAuthors);
router.post("/add", createAuthor);
router.delete("/:id", deleteAuthor);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthor);

// Upload Image to Cloudinary
router.post("/upload-image", upload.single("image"), uploadAuthorImage);

export default router;
