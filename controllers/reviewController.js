// controllers/reviewController.js
import Review from '../models/Review.js';

export const addReview = async (req, res) => {
  const { bookId } = req.params;
  const { email, rating, description } = req.body;

  try {
    const existing = await Review.findOne({ book: bookId, email });
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this book.' });
    }

    const review = new Review({
      book: bookId,
      email,
      rating,
      description
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review', details: err.message });
  }
};

export const getReviewsForBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const reviews = await Review.find({ book: bookId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const getBookAverageRating = async (req, res) => {
  const { bookId } = req.params;

  try {
    const stats = await Review.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      {
        $group: {
          _id: '$book',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }

    const { averageRating, totalReviews } = stats[0];
    res.json({ averageRating: averageRating.toFixed(1), totalReviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate average rating' });
  }
};
