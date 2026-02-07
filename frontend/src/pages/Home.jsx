import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import styles from "./Home.module.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/books", {
        params: {
          q: search || undefined,
          category: category || undefined,
        },
      });

      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, category]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="🔍 Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Business">Business</option>
          <option value="Technology">Technology</option>
          <option value="Self-Help">Self-Help</option>
          <option value="Biography">Biography</option>
          <option value="Education">Education</option>
        </select>
      </div>

      <div className={styles.grid}>
        {books.map((book) => (
          <BookCard key={book.id || book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Home;
