import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; 

// Routes
import authorRoutes from "./routes/authorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import feedbackRoutes from './routes/feedbackRoutes.js';
import articleRoutes from "./routes/articleRoutes.js";
import entryRoutes from './routes/entryRoutes.js';
import paymentRoutes from "./routes/payment.js";
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
  : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS BLOCKED:", origin);  // For debugging
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/images", imageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use("/api/articles", articleRoutes);
app.use('/api/entry', entryRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/books', reviewRoutes);
app.use("/api/auth", authRoutes);

// MongoDB connection
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

// Start server
const PORT = process.env.PORT || 3000;

connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
