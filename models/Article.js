import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  image: { type: String, required: true },
  topic: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true }
});

export default mongoose.model("Article", articleSchema);
