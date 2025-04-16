import express from "express";
import { getAuthors, getAuthorDetails, updateAuthor, upload, adminLogin } from "../controllers/adminController.js"; 
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/login", adminLogin); 

router.get("/", verifyToken, verifyAdmin, getAuthors);
router.get("/:id", verifyToken, verifyAdmin, getAuthorDetails); 
router.put("/:id", verifyToken, verifyAdmin, upload.single("image_path"), updateAuthor);

export default router;
