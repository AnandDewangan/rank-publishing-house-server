import express from 'express';
import {
  addTransaction,
  getTransactionsByAuthor,
  deleteTransaction
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/add', addTransaction); // For adding a transaction
router.get('/by-author/:authorId', getTransactionsByAuthor); // For fetching transactions by author ID
router.delete('/:id', deleteTransaction);

export default router;
