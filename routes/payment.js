// routes/payment.js
import express from "express";
import Razorpay from "razorpay";
import StoreOrder from "../models/StoreOrder.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_opnmIjBt5AXqbR",
  key_secret: "l5jZYi4Xg6n6G1VlXQikdGov",
});

// ✅ Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("❌ Razorpay Order Error:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

router.post("/store-order", async (req, res) => {
  try {
    const { formData, cartItems, paymentId } = req.body;
    
    const order = new StoreOrder({
      formData,
      cartItems,
      paymentId,
      createdAt: new Date(),
    });

    await order.save();
    res.status(200).json({ message: "Order saved successfully" });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await StoreOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await StoreOrder.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: req.body.status,
          trackingId: req.body.trackingId,
        },
      },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});


export default router;
