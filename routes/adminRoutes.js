import express from "express";
import multer from "multer";
import { getAuthors, getAuthorDetails, updateAuthor, adminLogin } from "../controllers/adminController.js"; 
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

router.post("/login", adminLogin); 

router.get("/", verifyToken, verifyAdmin, getAuthors);
router.get("/:id", verifyToken, verifyAdmin, getAuthorDetails); 
router.put("/:id", verifyToken, verifyAdmin, upload.single("image_path"), updateAuthor);

export default router;
