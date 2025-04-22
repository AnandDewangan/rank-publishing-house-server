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
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Admin routes 
app.use("/api/admin", adminRoutes);

// Author routes 
app.use("/api/authors", authorRoutes);

// Book routes 
app.use("/api/books", bookRoutes);

// Order routes 
app.use("/api/orders", orderRoutes);

// Transaction routes 
app.use("/api/transactions", transactionRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

// Export the Express app for Vercel to use as a serverless function
export default (req, res) => {
  app(req, res);  // This will allow Vercel to handle the request/response
};
