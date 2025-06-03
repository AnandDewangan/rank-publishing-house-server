import mongoose from "mongoose";

const StoreOrderSchema = new mongoose.Schema({
  formData: {
    name: String,
    email: String,
    contact: String,
    address: String,
    pincode: String,
  },
  cartItems: Array,
  paymentId: String,
  createdAt: Date,
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered"],
    default: "Pending",
  },
  trackingId: {
    type: String,
    default: "",
  },
});

const StoreOrder = mongoose.model("StoreOrder", StoreOrderSchema);
export default StoreOrder;
