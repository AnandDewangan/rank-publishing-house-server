// models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  isbn: { type: String, required: true },
  author: { type: String, required: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  title: { type: String, required: true },
  subtitle: { type: String },
  size: { type: String },
  pages: { type: String, required: true },
  color: { type: String, required: true },
  cover: { type: String, required: true },
  paperMrp: { type: String, required: true }, 
  rankStoreRoyalty: { type: String, required: true }, 
  eMrp: { type: String }, 
  eRoyalty: { type: String, required: true }, 
  hardMrp: { type: String },
  rankMrp: { type: String },
  cover_image: { type: String },
  description: { type: String },
  cat: { type: String },
},
{ timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
