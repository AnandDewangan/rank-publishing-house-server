import Order from "../models/Order.js";
import Book from "../models/Book.js";
import moment from "moment";

export const addOrder = async (req, res) => {
  try {
    const { bookId, orderId, channel, qty, createdAt } = req.body;

    const book = await Book.findById(bookId);

    if (!book) return res.status(404).json({ message: "Book not found" });

    const newOrder = new Order({
      book: bookId,
      authorId: book.authorId, // ✅ Fixed here
      orderId,
      channel,
      qty: Number(qty),
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    });

    await newOrder.save();
    res.status(201).json({ message: "Order added successfully", newOrder });
  } catch (error) {
    // console.error("❌ Error while adding order:", error);
    res.status(500).json({ message: "Failed to add order", error: error.message });
  }
};


// Controller to get orders by book ID
export const getOrdersByBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const orders = await Order.find({ book: bookId }).populate(
      "book",
      "title author"
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error });
  }
};

export const getBookOrderStats = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: "$channel",
          total: { $sum: "$qty" },
        },
      },
    ]);

    const stats = {
      total_amazon: 0,
      total_flipkart: 0,
      total_other: 0,
      total_ebook: 0,
      total_rankstore: 0,
    };

    result.forEach((item) => {
      const channel = item._id?.toLowerCase();
      if (channel === "amazon") stats.total_amazon = item.total;
      else if (channel === "flipkart") stats.total_flipkart = item.total;
      else if (channel === "e-book") stats.total_ebook = item.total;
      else if (channel === "rank-store") stats.total_rankstore = item.total;
      else stats.total_other += item.total;
    });

    res.json(stats);
  } catch (error) {
    console.error("Error getting book order stats:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getMonthlySales = async (req, res) => {
  try {
    const startDate = moment().subtract(11, "months").startOf("month").toDate();
    const endDate = moment().endOf("month").toDate();

    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$qty" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const months = [];
    const salesData = [];

    for (let i = 0; i < 12; i++) {
      const date = moment().subtract(11 - i, "months");
      const year = date.year();
      const month = date.month() + 1; // moment is 0-indexed
      const label = date.format("MMM YYYY");

      const record = sales.find(
        (s) => s._id.year === year && s._id.month === month
      );

      months.push(label);
      salesData.push(record ? record.totalSales : 0);
    }

    res.status(200).json({
      months,
      sales_data: salesData,
    });
  } catch (err) {
    console.error("Error in getMonthlySales:", err.message);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getSalesByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;

    // Get all books by the author with royalties
    const books = await Book.find({ authorId }).select("_id eRoyalty rankStoreRoyalty paperBackRoyalty");

    const bookRoyaltyMap = {};
    books.forEach((book) => {
      bookRoyaltyMap[book._id.toString()] = {
        eRoyalty: Number(book.eRoyalty) || 0,
        rankStoreRoyalty: Number(book.rankStoreRoyalty) || 0,
        paperBackRoyalty: Number(book.paperBackRoyalty) || 0,
      };
    });

    const bookIds = books.map((b) => b._id);
    const orders = await Order.find({ book: { $in: bookIds } });

    // Initialize totals
    let total_amazon = 0;
    let total_flipkart = 0;
    let total_other = 0;
    let total_ebook = 0;
    let total_paperback = 0;
    let total_rankstore = 0;
    let totalRoyalty = 0;

    // Go through each order
    orders.forEach((order) => {
      const { channel, book, qty } = order;
      const bookId = book.toString();
      const royalty = bookRoyaltyMap[bookId] || { eRoyalty: 0, rankStoreRoyalty: 0, paperBackRoyalty: 0 };

      if (channel === "E-Book") {
        total_ebook += qty;
        totalRoyalty += qty * royalty.eRoyalty;
      }
      else if (channel === "Rank-Store"){
        total_rankstore += qty;
        totalRoyalty += qty * royalty.rankStoreRoyalty;
      }
      else {
        if (channel === "Amazon") total_amazon += qty;
        else if (channel === "Flipkart") total_flipkart += qty;
        else total_other += qty;

        total_paperback += qty;
        totalRoyalty += qty * royalty.paperBackRoyalty;
      }
    });

    res.json({
      total_amazon,
      total_flipkart,
      total_other,
      total_ebook,
      total_paperback,
      total_rankstore,
      totalRoyalty: Math.round(totalRoyalty), 
    });
  } catch (error) {
    console.error("Error in getSalesByAuthor:", error);
    res.status(500).json({ message: "Failed to fetch author sales", error });
  }
};


export const getAuthorSales = async (req, res) => {
  try {
    const { authorId } = req.params;

    const orders = await Order.find({ authorId });

    const monthlySales = new Array(12).fill(0);

    orders.forEach((order) => {
      const monthIndex = new Date(order.createdAt).getMonth();
      monthlySales[monthIndex] += order.qty;
    });

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    res.json({
      months,
      sales_data: monthlySales,
    });
  } catch (error) {
    console.error("❌ Error fetching monthly sales:", error);
    res.status(500).json({ message: "Failed to fetch monthly sales data." });
  }
};

export const getBookOrder = async (req, res) => {
  try {
    const bestSelling = await Order.aggregate([
      {
        $group: {
          _id: "$book", // group by book ID
          totalQty: { $sum: "$qty" } // sum of quantities
        }
      },
      {
        $sort: { totalQty: -1 } // sort descending by qty
      },
      {
        $limit: 10 // only get the top one
      },
      {
        $lookup: {
          from: "books", // collection name
          localField: "_id",
          foreignField: "_id",
          as: "book"
        }
      },
      {
        $unwind: "$book" // unwind the populated book array
      },
      {
        $project: {
          _id: "$book._id",
          totalQty: 1,
          book: 1
        }
      }
    ]);

    res.status(200).json(bestSelling);
  } catch (error) {
    console.error("Error fetching best-selling book:", error);
    res.status(500).json({ message: "Server error" });
  }
};