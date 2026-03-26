import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import Book from "./models/Book.js";
import Order from "./models/Order.js";

dotenv.config();

const app = express();

/* ===================== Middleware ===================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://the-bookstore.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
});
app.use("/auth", authLimiter);

// CSRF protection: reject state-changing requests from unexpected origins
const csrfProtection = (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;
  if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};
app.use((req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  return next();
});

app.use("/auth", authRoutes);

/* ===================== MongoDB Connection ===================== */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Backend running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* ===================== Helpers ===================== */
const formatBook = ({ _id, __v, ...rest }) => ({
  id: _id.toString(),
  ...rest,
});

/* ===================== Auth Middleware ===================== */
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ error: "No token provided" });

    try {
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

// Unified books route (search + category + pagination)
app.get("/books", async (req, res) => {
  try {
    const { q, category, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const filter = {};
    if (q) filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { author: { $regex: q, $options: "i" } },
    ];
    if (category) filter.category = category;

    const [books, total] = await Promise.all([
      Book.find(filter).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Book.countDocuments(filter),
    ]);

    res.json({
      books: books.map(formatBook),
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("GET /books ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(formatBook(book));
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Book not found" });
    console.error("GET /books/:id ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add book (Admin only)
app.post("/books", authMiddleware(["admin"]), async (req, res) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    res.json(formatBook(saved.toObject()));
  } catch (err) {
    console.error("POST /books ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
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
    console.error("PUT /books/:id ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete book (Admin only)
app.delete("/books/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("DELETE /books/:id ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
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

    // Atomic stock validation + update
    for (const item of cart) {
      const updated = await Book.findOneAndUpdate(
        { _id: item.id || item._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );

      if (!updated) {
        return res.status(400).json({ error: `Insufficient stock for "${item.title}"` });
      }
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
    console.error("POST /orders ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
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
    console.error("GET /orders ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/orders/:id/status", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PLACED", "SHIPPED", "DELIVERED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

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
    console.error("ORDER STATUS ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ===================== Root ===================== */
app.get("/", (req, res) => {
  res.send("📚 Bookstore API is running...");
});

