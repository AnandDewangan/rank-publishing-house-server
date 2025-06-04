// routes/reviewRoutes.js
import express from 'express';
import {
  addReview,
  getReviewsForBook,
  getBookAverageRating,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/:bookId/reviews', addReview); // POST review
router.get('/:bookId/reviews', getReviewsForBook); // GET all reviews
router.get('/:bookId/reviews/average', getBookAverageRating); // GET avg rating + count

export default router;
