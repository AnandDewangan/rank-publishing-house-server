import express from "express";
import multer from "multer";
import { verifyAuthor } from "../middleware/auth.js";
import { authorLogin, getAuthorProfile , updateAuthor, getAuthorById, getAuthors, createAuthor, deleteAuthor } from "../controllers/authorController.js"; 

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


router.post("/login", authorLogin);
router.get("/profile", verifyAuthor, getAuthorProfile);
router.get("/", getAuthors);
router.post("/add", upload.single("image_path"), createAuthor); 
router.delete("/:id", deleteAuthor);
router.get("/:id", getAuthorById);
router.put("/update/:id", upload.single('image_path'), updateAuthor);

export default router;
