import Image from "../models/Image.js";
import { cloudinary } from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "gallery" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    const { name, title, description } = req.body;
    const newImage = await Image.create({
      url: result.secure_url,
      public_id: result.public_id,
      name,
      title,
      description,
    });

    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};

export const getImages = async (req, res) => {
  const images = await Image.find().sort({ uploadedAt: -1 });
  res.status(200).json(images);
};

export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await cloudinary.uploader.destroy(image.public_id);
    await image.deleteOne(); // ✅ use this instead of remove()

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res
      .status(500)
      .json({ message: "Server error during deletion", error: err });
  }
};

export const getBookImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    const imageUrls = images.map((image) => image.url);
    res.status(200).json(imageUrls);
  } catch (error) {
    res.status(500).json({ message: "Fetching failed", error });
  }
};
