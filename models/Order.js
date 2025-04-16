import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  orderId: { type: String, required: true },
  channel: { type: String, required: true },
  qty: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

export default mongoose.model('Order', orderSchema);
