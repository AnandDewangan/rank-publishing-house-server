import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  amount: Number,
  transaction_id: String,
  source_of_payment: String,
  status: { type: String, enum: ["pending", "success", "failed"], default: "success" },
  transaction_date_time: { type: Date, default: Date.now }
});


const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
