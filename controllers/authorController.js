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
      account_type, upi_id, bio, image_path
    } = req.body;

    // Check for duplicate email, SKU, and ISBN
    const existingEmail = await Author.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });

    const existingSku = await Author.findOne({ sku });
    if (existingSku) return res.status(400).json({ message: "SKU already exists" });

    const existingIsbn = await Author.findOne({ isbn });
    if (existingIsbn) return res.status(400).json({ message: "ISBN already exists" });

    // Assuming image_path is the ImageKit URL
    const newAuthor = new Author({
      sku,
      isbn,
      image_path: image_path || "", // Use the URL from ImageKit
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

    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Author deleted" });

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
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const { image_path, image_public_id, ...restData } = req.body;

    // If new image uploaded and there's an old one, delete the old one
    if (image_public_id && image_public_id !== author.image_public_id) {
      try {
        await cloudinary.uploader.destroy(author.image_public_id);
      } catch (deleteErr) {
        console.error("Failed to delete old image:", deleteErr);
      }
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        ...restData,
        image_path: image_path || author.image_path,
        image_public_id: image_public_id || author.image_public_id,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAuthor) {
      return res.status(500).json({ message: "Failed to update author" });
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update author", error });
  }
};
