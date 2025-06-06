// ✅ Auth.js (model)
import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ✅ Add this
  mobile: String,
  address: String,
  purchasedEbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ebook" }],
}, { timestamps: true });

const User = mongoose.model("Auth", authSchema);
export default User;
