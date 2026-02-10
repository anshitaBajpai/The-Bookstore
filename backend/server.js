import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes.js";
import Book from "./models/Book.js";
import Order from "./models/Order.js";

dotenv.config();

const app = express();

/* ===================== Middleware ===================== */
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

/* ===================== MongoDB Connection ===================== */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ===================== Helpers ===================== */
const formatBook = ({ _id, __v, ...rest }) => ({
  id: _id.toString(),
  ...rest,
});

/* ===================== Auth Middleware ===================== */
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};

/* ===================== BOOK ROUTES ===================== */

// Unified books route (search + category)
app.get("/books", async (req, res) => {
  try {
    const { q, category } = req.query;

    const filter = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    const books = await Book.find(filter).lean();
    res.json(books.map(formatBook));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(formatBook(book));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add book (Admin only)
app.post("/books", authMiddleware(["admin"]), async (req, res) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    res.json(formatBook(saved.toObject()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book (Admin only)
app.put("/books/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).lean();

    if (!updated) return res.status(404).json({ error: "Book not found" });

    res.json(formatBook(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete book (Admin only)
app.delete("/books/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================== ORDER ROUTES ===================== */

// Place order
app.post("/orders", authMiddleware(), async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Stock validation + update
    for (const item of cart) {
      const book = await Book.findById(item.id || item._id);

      if (!book || book.stock < item.quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      book.stock -= item.quantity;
      await book.save();
    }

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = new Order({
      userId: req.user.id,
      items: cart.map((item) => ({
        bookId: item.id || item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
    });

    await order.save();

    res.json({ message: "Order placed successfully ✅", order });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user orders
app.get("/orders", authMiddleware(), async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/orders/:id/status", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================== Root ===================== */
app.get("/", (req, res) => {
  res.send("📚 Bookstore API is running...");
});

/* ===================== Start Server ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`),
);
