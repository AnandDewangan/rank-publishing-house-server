import express from 'express';
import {
  addTransaction,
  getTransactionsByAuthor,
  deleteTransaction
} from '../controllers/transactionController.js';
import Transaction from '../models/Daily.js';

const router = express.Router();

// Route to add transaction using controller logic
router.post('/add', addTransaction);

// Route to get transactions by author ID
router.get('/by-author/:authorId', getTransactionsByAuthor);

// Route to delete a transaction by ID
router.delete('/:id', deleteTransaction);

// Route to add a transaction directly (optional fallback or testing purpose)
router.post('/', async (req, res) => {
  try {
    const newTx = new Transaction(req.body);
    await newTx.save();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get transactions filtered by month and year
router.get('/', async (req, res) => {
  const { month, year } = req.query;
  try {
    let query = {};
    if (month && year) {
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      query.date = { $gte: start, $lt: end };
    }
    const txs = await Transaction.find(query).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
