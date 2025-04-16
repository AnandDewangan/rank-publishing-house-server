import Author from "../models/Author.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export const authorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(400).json({ message: "Author not found" });
    }

    if (password !== author.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: author._id, role: "author" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, authorId: author._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getAuthorProfile = (req, res) => {
  res.status(200).json({
    success: true,
    author: req.author,
  });
}; 

export const createAuthor = async (req, res) => {
  try {
    const {
      sku, isbn, name, email, password, contact_no, first_book_name,
      account_number, account_holder_name, bank_name, ifsc_code,
      account_type, upi_id, bio
    } = req.body;

    // ✅ Check for duplicate email
    const existingEmail = await Author.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Check for duplicate SKU
    const existingSku = await Author.findOne({ sku });
    if (existingSku) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    // ✅ Check for duplicate ISBN
    const existingIsbn = await Author.findOne({ isbn });
    if (existingIsbn) {
      return res.status(400).json({ message: "ISBN already exists" });
    }

    const imagePath = req.file ? req.file.filename : "";

    const newAuthor = new Author({
      sku,
      isbn,
      image_path: imagePath,
      name,
      email,
      password,
      contact_no,
      first_book_name,
      account_number,
      account_holder_name,
      bank_name,
      ifsc_code,
      account_type,
      upi_id,
      bio
    });

    await newAuthor.save();
    res.status(201).json({ message: "Author created successfully", newAuthor });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


export const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: "Author not found" });

    // Delete image
    const imagePath = path.join("uploads", author.image_path);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Author and image deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting author", error });
  }
};

export const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (err) {
    console.error("Error fetching authors:", err.message);
    res.status(500).json({ message: "Error fetching authors" });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: "Author not found" });
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: "Error fetching author", error });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ message: "Failed to update author", error });
  }
}; 