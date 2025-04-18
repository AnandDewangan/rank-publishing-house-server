import cloudinary from "../utils/cloudinary.js";

export const createAuthor = async (req, res) => {
  try {
    const file = req.file;

    let imageUrl = "";
    if (file) {
      const uploadResult = await cloudinary.uploader.upload_stream(
        { folder: "authors" },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed", details: error });
          }

          imageUrl = result.secure_url;

          // Save the author to DB here, after getting imageUrl
          const newAuthor = new Author({
            ...req.body,
            image_path: imageUrl,
          });

          newAuthor.save().then((savedAuthor) => {
            res.status(201).json(savedAuthor);
          });
        }
      );

      // Pipe file buffer to upload
      const streamifier = await import("streamifier");
      streamifier.default.createReadStream(file.buffer).pipe(uploadResult);
    } else {
      // No file uploaded
      const newAuthor = new Author(req.body);
      await newAuthor.save();
      res.status(201).json(newAuthor);
    }

  } catch (error) {
    console.error("Error creating author:", error);
    res.status(500).json({ error: "Server error" });
  }
};
