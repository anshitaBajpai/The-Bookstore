import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import Header from "../components/Header";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const fetchBooks = async () => {
    const res = search
      ? await axios.get(`http://localhost:5000/books/search?q=${search}`)
      : await axios.get("http://localhost:5000/books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  return (
    <>
      <Header />
      <div style={{ padding: "20px" }}>
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "20px 0", borderRadius: "8px" }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {books.map((book) => (
            <BookCard key={book.id || book._id} book={book} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
