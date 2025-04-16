import Book from '../models/Book.js';
import Order from "../models/Order.js";
import Transaction from "../models/Transaction.js"; 
import mongoose from 'mongoose';
import moment from "moment";

// Controller to add a new book
export const addBook = async (req, res) => {
  try {
    const {
      sku,
      isbn,
      author,
      authorId,
      title,
      subtitle,
      size,
      pages,
      color,
      cover,
      paperMrp,
      eMrp,
      hardMrp,
      rankMrp,
    } = req.body;
    
    const coverImage = req.file ? req.file.filename : null;

    const newBook = new Book({
      sku,
      isbn,
      author,
      authorId,
      title,
      subtitle,
      size,
      pages,
      color,
      cover,
      paperMrp,
      eMrp,
      hardMrp,
      rankMrp,
      cover_image: coverImage,
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', newBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add book', error });
  }
};

// Controller to update an existing book (including order details)
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params; 
    const {
      sku,
      isbn,
      author,
      authorId,
      title,
      subtitle,
      size,
      pages,
      color,
      cover,
      paperMrp,
      eMrp,
      hardMrp,
      rankMrp,
      orderId,
      channel,
      qty,
      createdAt,
    } = req.body;

    const coverImage = req.file ? req.file.filename : null;

    const updateData = {
      sku,
      isbn,
      author,
      authorId,
      title,
      subtitle,
      size,
      pages,
      color,
      cover,
      paperMrp,
      eMrp,
      hardMrp,
      rankMrp,
      orderId,
      channel,
      qty,
      createdAt,
    };

    // Only update cover image if a new one was uploaded
    if (coverImage) {
      updateData.cover_image = coverImage;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book updated successfully', newBook: updatedBook });
  } catch (error) {
    console.error('Error in updateBook:', error);
    res.status(500).json({ message: 'Failed to update book', error });
  }
};


export const getBooks = async (req, res) => {
  try {
    const { authorId } = req.query;
    let books;

    if (authorId) {
      books = await Book.find({ authorId }); // filter by authorId if provided
    } else {
      books = await Book.find(); // get all books if no authorId
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params; // Get the book ID from the URL parameters
    
    const book = await Book.findByIdAndDelete(id); // Find and delete the book by its ID
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error });
  }
}; 

export const getAuthorBookStats = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    const books = await Book.find({ authorId: new mongoose.Types.ObjectId(authorId) });
    const totalBooks = books.length;

    // Get all successful transactions for the given author
    const successfulTransactions = await Transaction.find({
      author_id: new mongoose.Types.ObjectId(authorId),
      status: "success",
    });

    // Calculate the total number of successful transactions
    const totalTransactions = successfulTransactions.length;

    // Calculate the total sum of the amount from successful transactions
    const totalTransactionAmount = successfulTransactions.reduce((acc, txn) => acc + (txn.amount || 0), 0);

    // Time-based Book Stats
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const lastMonthOrders = books.filter(
      (book) => new Date(book.createdAt) > lastMonth
    ).length;

    const lastWeekOrders = books.filter(
      (book) => new Date(book.createdAt) > lastWeek
    ).length;

    const dailyOrders = books.filter(
      (book) => new Date(book.createdAt) > today
    ).length;

    // Sending the response
    res.json({
      totalBooks,
      totalTransactions,
      totalTransactionAmount,
      totalOrders: totalBooks,
      lastMonthOrders,
      lastWeekOrders,
      dailyOrders,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
}; 


export const getBookStats = async (req, res) => {
  try {
    const now = moment();
    const startOfToday = now.clone().startOf("day");
    const startOfWeek = now.clone().startOf("isoWeek");
    const startOfMonth = now.clone().startOf("month"); 

    const totalOrders = await Book.countDocuments();
    const lastMonthOrders = await Book.countDocuments({
      createdAt: { $gte: startOfMonth.toDate() }
    });
    const lastWeekOrders = await Book.countDocuments({
      createdAt: { $gte: startOfWeek.toDate() }
    });
    const dailyOrders = await Book.countDocuments({
      createdAt: { $gte: startOfToday.toDate() }
    });

    return res.status(200).json({
      totalOrders,
      lastMonthOrders,
      lastWeekOrders,
      dailyOrders
    });
  } catch (error) {
    console.error("❌ Error in getBookStats:", error);
    return res.status(500).json({
      message: "Failed to fetch book statistics",
      error: error.message
    });
  }
};