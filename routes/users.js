const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// CREATE
router.post("/", upload.single("image"), async (req, res) => {
  const { name, email } = req.body;
  const image = req.file.filename;

  const newUser = new User({ name, email, image });
  await newUser.save();
  res.json(newUser);
});

// READ ALL
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, email } = req.body;
  const updateData = { name, email };
  if (req.file) {
    updateData.image = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updatedUser);
});

router.delete("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Delete image from uploads folder
      const imagePath = path.join(__dirname, "..", "uploads", user.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
  
      // Delete user from database
      await User.findByIdAndDelete(req.params.id);
  
      res.json({ message: "User and image deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
