import express from 'express';
import multer from 'multer';
import { storage } from "../utils/cloudinary.js";
import { deleteBook, addBook, getBooks, updateBook, getBookStats, getAuthorBookStats } from '../controllers/bookController.js';

const router = express.Router();

const upload = multer({ storage });

// Route to add a book
router.post('/add-book', upload.single('cover_image'), addBook); 
// Route to update a book
router.put('/update-book/:id', upload.single('cover_image'), updateBook); 
// Route to get all books
router.get('/', getBooks);

router.delete('/delete-book/:id', deleteBook); 
router.get("/stats", getBookStats); 
router.get("/stats/:authorId", getAuthorBookStats);

export default router;
