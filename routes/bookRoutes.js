import express from 'express';
import memoryUpload from '../middleware/multer.js';
import { uploadBookImage } from '../utils/cloudinary.js';
import {
  deleteBook,
  addBook,
  getBooks,
  updateBook,
  getBookStats,
  getAuthorBookStats
} from '../controllers/bookController.js';

const router = express.Router();

// Upload book image + save book in DB
router.post('/add-book', memoryUpload.single('cover_image'), async (req, res) => {
  try {
    const imageRes = await uploadBookImage(req); // upload to cloudinary
    req.body.cover_image = imageRes.url;
    req.body.image_public_id = imageRes.public_id;

    // Call the controller manually
    await addBook(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Upload + Book Add failed', details: err.message });
  }
});

// Update book (same logic as add)
router.put('/update-book/:id', memoryUpload.single('cover_image'), async (req, res) => {
  try {
    if (req.file) {
      const imageRes = await uploadBookImage(req);
      req.body.cover_image = imageRes.url;
      req.body.image_public_id = imageRes.public_id;
    }
    await updateBook(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
});

// Upload-only endpoint (optional, not needed now)
router.post('/upload-image', memoryUpload.single('image'), uploadBookImage);

router.get('/', getBooks);
router.delete('/delete-book/:id', deleteBook);
router.get("/stats", getBookStats);
router.get("/stats/:authorId", getAuthorBookStats);

export default router;
