import User from "../models/User.js";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage }); 

export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_ID &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}; 

export const getAuthors = async (req, res) => {
  try {
    const authors = await User.find({ role: "author" }).select("-password");
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuthorDetails = async (req, res) => {
  try {
    const author = await User.findById(req.params.id).populate("books transactions");
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    if (req.file) {
      req.body.image_path = `/uploads/${req.file.filename}`;
    }

    const updatedAuthor = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

