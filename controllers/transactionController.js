import Transaction from "../models/Transaction.js"; // ✅ make sure this file exists and is spelled right

export const addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionsByAuthor = async (req, res) => {
    try {
      const authorId = req.params.authorId;
      const transactions = await Transaction.find({ author_id: authorId }).sort({
        transaction_date_time: -1,
      });
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this author.' });
      }
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const deleteTransaction = async (req, res) => {
    try {
      const transaction = await Transaction.findByIdAndDelete(req.params.id);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  