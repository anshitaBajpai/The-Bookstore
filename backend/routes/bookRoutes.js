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

// Get all books
router.get("/", async (req, res) => {
  try {
  const books = await Book.find().lean();
  res.json(books.map(formatBook));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
