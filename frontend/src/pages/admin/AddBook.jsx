import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config.js";

function AddBook() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    price: "",
    image: "",
    summary: "",
    category: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(book),
      });
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
        />{" "}
        <br />
        <input
          name="author"
          placeholder="Author"
          onChange={handleChange}
          required
        />{" "}
        <br />
        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
        />{" "}
        <br />
        <input
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
        />{" "}
        <br />
        <textarea
          name="summary"
          placeholder="Summary"
          onChange={handleChange}
          rows={3}
        />{" "}
        <br />
        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          required
        />{" "}
        <br />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          onChange={handleChange}
          required
        />{" "}
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

export default AddBook;
