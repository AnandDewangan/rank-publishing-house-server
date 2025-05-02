import express from 'express';
import {
  addTransaction,
  getTransactionsByAuthor,
  deleteTransaction
} from '../controllers/transactionController.js';
import Transaction from '../models/Daily.js';

const router = express.Router();

router.post('/add', addTransaction);
router.get('/by-author/:authorId', getTransactionsByAuthor);
router.delete('/:id', deleteTransaction);

router.post('/', async (req, res) => {
  try {
    const newTx = new Transaction(req.body);
    await newTx.save();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all transactions
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
