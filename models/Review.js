// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
