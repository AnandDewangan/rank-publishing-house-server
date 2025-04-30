import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAuthorImage = async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: "No file uploaded or buffer missing" });
  }

  try {
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "authors" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();
    res.status(200).json({ 
      url: result.secure_url, 
      public_id: result.public_id 
    });

  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Image upload failed", details: err.message });
  }
};

// ✅ Modified version: no `res`, returns image result directly
export const uploadBookImage = async (req) => {
  if (!req.file || !req.file.buffer) {
    throw new Error("No file uploaded or buffer missing");
  }

  const streamUpload = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "books" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

  const result = await streamUpload();
  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

export { cloudinary };
