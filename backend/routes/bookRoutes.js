import express from "express";
import Book from "../models/Book.js";
// Helper to map _id to id
const formatBook = ({ _id, __v, ...rest }) => ({
  id: _id.toString(),
  ...rest,
});

const router = express.Router();

// Add new book
router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(formatBook(book.toObject()));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all books (supports q, category, minPrice, maxPrice, sort, limit)
router.get("/", async (req, res) => {
  try {
    const { q, category, sort, limit } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    let sortOption = { _id: -1 }; // newest first by default
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };

    let query = Book.find(filter).sort(sortOption).lean();
    if (limit) query = query.limit(Number(limit));

    const books = await query;
    res.json(books.map(formatBook));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(formatBook(book));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
