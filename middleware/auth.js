import jwt from "jsonwebtoken";
import Author from "../models/Author.js";

export const verifyAuthor = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const author = await Author.findById(decoded.id).select("-password");
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    req.author = author;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
