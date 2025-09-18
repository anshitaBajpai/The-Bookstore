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
  background: "linear-gradient(120deg, #e0ffef 0%, #43c6ac 60%, #191654 100%)",
  borderRadius: "16px",
  boxShadow: "0 4px 24px #134e4a55"
      }}>
  <h1 style={{ textAlign: "center", color: "#134e4a", fontWeight: 700, fontSize: "2rem", marginBottom: 32, letterSpacing: 1 }}>Admin Dashboard</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #43c6ac",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #134e4a22"
            }}
            onFocus={e => e.target.style.border = "2px solid #134e4a"}
            onBlur={e => e.target.style.border = "1.5px solid #43c6ac"}
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
              background: "#43c6ac",
              color: "#134e4a",
              fontWeight: 700,
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px #134e4a22",
              transition: "background 0.2s, color 0.2s"
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#134e4a";
              e.currentTarget.style.color = "#43c6ac";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#43c6ac";
              e.currentTarget.style.color = "#134e4a";
            }}
          >
            {editingBook ? "Update Book" : "Add Book"}
          </button>
        </form>
  <div style={{ background: "#e0ffef", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px #43c6ac99", marginTop: "24px" }}>
          {books.map((book) => (
            <div key={book.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", padding: "12px 0", borderBottom: "1px solid #43c6ac" }}>
              <div>
                <span style={{ color: "#134e4a", fontWeight: 600 }}>{book.title}</span> - <span style={{ color: "#43c6ac" }}>{book.author}</span> - <span style={{ color: "#191654" }}>₹{book.price}</span>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(book)}
                  style={{
                    marginRight: 8,
                    background: "#43c6ac",
                    color: "#134e4a",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "background 0.2s, color 0.2s"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "#134e4a";
                    e.currentTarget.style.color = "#43c6ac";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "#43c6ac";
                    e.currentTarget.style.color = "#134e4a";
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
                    e.currentTarget.style.background = "#134e4a";
                    e.currentTarget.style.color = "#43c6ac";
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
