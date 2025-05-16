import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Article from "../models/Article.js";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "articles" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const createArticle = async (req, res) => {
  try {
    const { topic, date, description } = req.body;

    let imageUrl = "";
    if (req.file && req.file.buffer) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newArticle = new Article({ topic, date, description, image: imageUrl });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    console.error("Article creation error:", err);
    res.status(400).json({ error: "Failed to create article" });
  }
};


export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete article" });
  }
};
