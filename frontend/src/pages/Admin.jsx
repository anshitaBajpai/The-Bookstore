import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Admin.module.css";

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

  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:5000/books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, author, price, image, category, stock, summary };
    if (editingBook) {
      await axios.put(
        `http://localhost:5000/books/${editingBook.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } else {
      await axios.post("http://localhost:5000/books", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    await axios.delete(`http://localhost:5000/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>

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
          onChange={e => setSummary(e.target.value)}
          rows={3}
        />
        <button className={styles.primaryButton}>
          {editingBook ? "Update Book" : "Add Book"}
        </button>
      </form>

      <div className={styles.listContainer}>
        {books.map((book) => (
          <div key={book.id} className={styles.bookRow}>
            <div>
              <span className={styles.bookTitle}>{book.title}</span> –{" "}
              <span className={styles.bookAuthor}>{book.author}</span> –{" "}
              <span className={styles.bookPrice}>₹{book.price}</span>
            </div>

            <div>
              <button
                className={styles.editBtn}
                onClick={() => handleEdit(book)}
              >
                Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
