import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./Admin.module.css";
import { API_URL } from "../config.js";

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [summary, setSummary] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchBooks = async () => {
    const res = await axios.get(`${API_URL}/books`);
    setBooks(Array.isArray(res.data) ? res.data : res.data.books || []);
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`);
      setStats(res.data);
    } catch {
      // stats are non-critical, fail silently
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { title, author, price, image, category, stock, summary };
    try {
      if (editingBook) {
        await axios.put(`${API_URL}/books/${editingBook.id}`, payload);
        toast.success("Book updated successfully");
      } else {
        await axios.post(`${API_URL}/books`, payload);
        toast.success("Book added successfully");
      }
      setTitle("");
      setAuthor("");
      setPrice("");
      setImage("");
      setCategory("");
      setStock("");
      setSummary("");
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setPrice(book.price);
    setImage(book.image);
    setCategory(book.category);
    setStock(book.stock);
    setSummary(book.summary || "");
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/books/${id}`);
      toast.success("Book deleted");
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.error || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>

      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📚</span>
            <span className={styles.statValue}>{stats.totalBooks}</span>
            <span className={styles.statLabel}>Total Books</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📦</span>
            <span className={styles.statValue}>{stats.totalOrders}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>💰</span>
            <span className={styles.statValue}>
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </span>
            <span className={styles.statLabel}>Total Revenue</span>
          </div>
          <div
            className={`${styles.statCard} ${stats.lowStock > 0 ? styles.statCardWarn : ""}`}
          >
            <span className={styles.statIcon}>⚠️</span>
            <span className={styles.statValue}>{stats.lowStock}</span>
            <span className={styles.statLabel}>Low Stock</span>
          </div>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className={styles.input}
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          className={styles.input}
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <input
          className={styles.input}
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option>Fiction</option>
          <option>Business</option>
          <option>Technology</option>
          <option>Self-Help</option>
          <option>Biography</option>
          <option>Education</option>
        </select>
        <textarea
          className={styles.input}
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
        />
        <button className={styles.primaryButton} disabled={submitting}>
          {submitting ? "Saving..." : editingBook ? "Update Book" : "Add Book"}
        </button>
      </form>

      <div className={styles.listContainer}>
        {(() => {
          const lowStockBooks = books.filter((b) => b.stock < 5);
          return lowStockBooks.length > 0 ? (
            <div className={styles.lowStockBanner}>
              ⚠️ {lowStockBooks.length} book
              {lowStockBooks.length > 1 ? "s" : ""} running low on stock
            </div>
          ) : null;
        })()}

        {books.map((book) => (
          <div
            key={book.id}
            className={`${styles.bookRow} ${book.stock < 5 ? styles.bookRowLowStock : ""}`}
          >
            <div className={styles.bookInfo}>
              <span className={styles.bookTitle}>{book.title}</span>
              <span className={styles.bookMeta}>
                <span className={styles.bookAuthor}>{book.author}</span>
                <span className={styles.bookPrice}>₹{book.price}</span>
                <span
                  className={
                    book.stock === 0
                      ? styles.badgeOut
                      : book.stock < 5
                        ? styles.badgeLow
                        : styles.badgeOk
                  }
                >
                  {book.stock === 0 ? "Out of stock" : `${book.stock} in stock`}
                </span>
              </span>
            </div>

            <div className={styles.bookActions}>
              <button
                className={styles.editBtn}
                onClick={() => handleEdit(book)}
              >
                Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(book.id)}
                disabled={deletingId === book.id}
              >
                {deletingId === book.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
