// index.js (या api/index.js अगर आप Vercel के /api structure में हैं)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authorRoutes from "./routes/authorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "https://www.rankpublishinghouse.online", // या "*" temporarily
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/transactions", transactionRoutes);

// MongoDB Connection — यह check करें कि connection repeat ना हो
let isConnected = false;

const connectToMongo = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Exporting for Vercel
export default async function handler(req, res) {
  await connectToMongo();
  return app(req, res);
}
