import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_URL}/books`);
        setBooks(res.data);
      } catch (err) {
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`${API_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting book");
    }
  };

  if (loading) return <p>Loading books...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Admin Dashboard</h1>
      <Link to="/admin/add">
        <button style={{ margin: "10px 0", padding: "10px" }}>
          ➕ Add Book
        </button>
      </Link>

      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <table border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>₹{book.price}</td>
                <td>
                  <Link to={`/admin/edit/${book.id}`}>
                    <button>✏️ Edit</button>
                  </Link>
                  <button
                    onClick={() => deleteBook(book.id)}
                    style={{ marginLeft: "8px" }}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
