import express from 'express';
import multer from 'multer';
import { deleteBook, addBook, getBooks, updateBook, getBookStats, getAuthorBookStats } from '../controllers/bookController.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

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
