import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditBook() {
  const { id } = useParams();
  const [book, setBook] = useState({
    title: "",
    author: "",
    price: "",
    image: "",
    summary: "",
  });
  const navigate = useNavigate();

  // Fetch book details
  useEffect(() => {
    fetch(`http://localhost:5000/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    navigate("/admin");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>✏️ Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={book.title}
          onChange={handleChange}
          required
        />{" "}
        <br />
        <input
          name="author"
          placeholder="Author"
          value={book.author}
          onChange={handleChange}
          required
        />{" "}
        <br />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={book.price}
          onChange={handleChange}
          required
        />{" "}
        <br />
        <input
          name="image"
          placeholder="Image URL"
          value={book.image}
          onChange={handleChange}
        />{" "}
        <br />
        <textarea
          name="summary"
          placeholder="Summary"
          value={book.summary}
          onChange={handleChange}
          rows={3}
        />{" "}
        <br />
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
}

export default EditBook;
