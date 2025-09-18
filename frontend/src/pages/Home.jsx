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
      <div style={{ padding: "20px 48px", minHeight: "100vh", background: "linear-gradient(120deg, #e0ffef 0%, #43c6ac 60%, #191654 100%)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "28px 0 32px 0" }}>
          <input
            type="text"
            placeholder="🔍 Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "340px",
              maxWidth: "95%",
              padding: "12px 18px",
              borderRadius: "24px",
              border: "2px solid #43c6ac",
              color: "#134e4a",
              fontSize: "1.1rem",
              background: "#e0ffef",
              boxShadow: "0 2px 12px #43c6ac33",
              outline: "none",
              transition: "border 0.2s, box-shadow 0.2s"
            }}
            onFocus={e => {
              e.target.style.border = "2.5px solid #134e4a";
              e.target.style.boxShadow = "0 4px 18px #43c6ac55";
            }}
            onBlur={e => {
              e.target.style.border = "2px solid #43c6ac";
              e.target.style.boxShadow = "0 2px 12px #43c6ac33";
            }}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            paddingLeft: "24px",
            paddingRight: "24px"
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
