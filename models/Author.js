import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  sku: String,
  isbn: String,
  image_path: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  contact_no: String,
  first_book_name: String,
  account_number: String,
  account_holder_name: String,
  bank_name: String,
  ifsc_code: String,
  account_type: String,
  upi_id: String,
  bio: String,
}, { timestamps: true });

export default mongoose.model("Author", authorSchema);
