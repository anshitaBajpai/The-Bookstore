import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Book from "./models/Book.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

// ===================== Middleware =====================
app.use(cors());
app.use(express.json());

// ===================== MongoDB Connection =====================
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===================== Helper =====================
const formatBook = ({ _id, __v, ...rest }) => ({
  id: _id.toString(),
  ...rest,
});

// ===================== Auth Middleware =====================
export const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      req.user = decoded; // attach user info
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};

// ===================== Auth Routes =====================
// Signup
app.post("/auth/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, role: role || "user" });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: newUser.role, username: newUser.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== Book Routes =====================
// Get all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().lean();
    res.json(books.map(formatBook));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search books
app.get("/books/search", async (req, res) => {
  try {
    const { q } = req.query;
    const books = await Book.find({ title: { $regex: q, $options: "i" } }).lean();
    res.json(books.map(formatBook));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new book (Admin only)
app.post("/books", async (req, res) => {
  try {
    let result;
    if (Array.isArray(req.body)) {
      const books = await Book.insertMany(req.body);
      result = books.map((b) => formatBook(b.toObject()));
    } else {
      const newBook = new Book(req.body);
      const saved = await newBook.save();
      result = formatBook(saved.toObject());
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book (Admin only)
app.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.json(formatBook(updatedBook));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete book (Admin only)
app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id).lean();
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully", id: deletedBook._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/books", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const books = await Book.find(filter).lean();

    res.json(books.map(formatBook));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Root route
app.get("/", (req, res) => {
  res.send("📚 Bookstore API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
