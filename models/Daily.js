import mongoose from 'mongoose';

const dailySchema = new mongoose.Schema({
  amount: Number,
  type: { type: String, enum: ['income', 'expense'] },
  reference: String,
  description: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Daily', dailySchema);
