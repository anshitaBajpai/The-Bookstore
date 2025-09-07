import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
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
    try {
      if (editingBook) {
        await axios.put(
          `http://localhost:5000/books/${editingBook.id}`,
          { title, author, price, image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/books",
          { title, author, price, image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setTitle(""); setAuthor(""); setPrice(""); setImage(""); setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setPrice(book.price);
    setImage(book.image);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks();
  };

  return (
    <>
      <Header />
      <div style={{
        padding: "32px",
        maxWidth: 700,
        margin: "0 auto",
        background: "linear-gradient(120deg, #232946 0%, #7fffd4 100%)",
        borderRadius: "16px",
        boxShadow: "0 4px 24px #1a223f55"
      }}>
        <h1 style={{ textAlign: "center", color: "#232946", fontWeight: 700, fontSize: "2rem", marginBottom: 32, letterSpacing: 1 }}>Admin Dashboard</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #7fffd4",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #23294622"
            }}
            onFocus={e => e.target.style.border = "2px solid #232946"}
            onBlur={e => e.target.style.border = "1.5px solid #7fffd4"}
          />
          <input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #7fffd4",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #23294622"
            }}
            onFocus={e => e.target.style.border = "2px solid #232946"}
            onBlur={e => e.target.style.border = "1.5px solid #7fffd4"}
          />
          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #7fffd4",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #23294622"
            }}
            onFocus={e => e.target.style.border = "2px solid #232946"}
            onBlur={e => e.target.style.border = "1.5px solid #7fffd4"}
          />
          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #7fffd4",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #23294622"
            }}
            onFocus={e => e.target.style.border = "2px solid #232946"}
            onBlur={e => e.target.style.border = "1.5px solid #7fffd4"}
          />
          <button
            type="submit"
            style={{
              background: "#7fffd4",
              color: "#232946",
              fontWeight: 700,
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px #23294622",
              transition: "background 0.2s, color 0.2s"
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#232946";
              e.currentTarget.style.color = "#7fffd4";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#7fffd4";
              e.currentTarget.style.color = "#232946";
            }}
          >
            {editingBook ? "Update Book" : "Add Book"}
          </button>
        </form>
        <div style={{ background: "#232946", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px #1a223f99", marginTop: "24px" }}>
          {books.map((book) => (
            <div key={book.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", padding: "12px 0", borderBottom: "1px solid #7fffd4" }}>
              <div>
                <span style={{ color: "#a3bffa", fontWeight: 600 }}>{book.title}</span> - <span style={{ color: "#7fffd4" }}>{book.author}</span> - <span style={{ color: "#eebbc3" }}>₹{book.price}</span>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(book)}
                  style={{
                    marginRight: 8,
                    background: "#eebbc3",
                    color: "#232946",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "background 0.2s, color 0.2s"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "#232946";
                    e.currentTarget.style.color = "#eebbc3";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "#eebbc3";
                    e.currentTarget.style.color = "#232946";
                  }}
                >Edit</button>
                <button
                  onClick={() => handleDelete(book.id)}
                  style={{
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "background 0.2s, color 0.2s"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "#232946";
                    e.currentTarget.style.color = "#eebbc3";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "#e53935";
                    e.currentTarget.style.color = "#fff";
                  }}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Admin;
