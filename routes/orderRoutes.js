import express from 'express';
import { addOrder, getOrdersByBook, deleteOrder, getBookOrderStats, getMonthlySales, getSalesByAuthor, getAuthorSales, getBookOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/add-order', addOrder);
router.get('/get-orders-by-book/:bookId', getOrdersByBook); 
router.delete('/delete-order/:id', deleteOrder);
router.get("/book-orders", getBookOrderStats);
router.get("/monthly", getMonthlySales);
router.get("/author-sales/:authorId", getSalesByAuthor);
router.get("/monthly/:authorId", getAuthorSales);
router.get("/best-selling", getBookOrder);

export default router;
