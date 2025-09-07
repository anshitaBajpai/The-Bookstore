import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBook() {
  const [book, setBook] = useState({ title: "", author: "", price: "", image: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    navigate("/admin");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required /> <br />
        <input name="author" placeholder="Author" onChange={handleChange} required /> <br />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required /> <br />
        <input name="image" placeholder="Image URL" onChange={handleChange} /> <br />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;
