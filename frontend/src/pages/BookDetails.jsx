import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import CartContext from "../context/CartContext";

const dummyBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    price: 450,
    desc: "A book about building good habits.",
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 299,
    desc: "A story about following your dreams.",
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 650,
    desc: "A guide to writing maintainable code.",
  },
];

function BookDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const book = dummyBooks.find((b) => b.id === parseInt(id));

  if (!book)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(120deg, #1a223f 0%, #232946 100%)",
          color: "#a3bffa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}
      >
        Book not found
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #1a223f 0%, #232946 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#a3bffa",
      }}
    >
      <div
        style={{
          background: "#232946",
          padding: "40px 32px",
          borderRadius: "18px",
          boxShadow: "0 4px 18px 0 #1a223f99",
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          border: "1.5px solid #3b4a6b",
        }}
      >
        <h1
          style={{
            color: "#a3bffa",
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: 12,
          }}
        >
          {book.title}
        </h1>
        <p style={{ color: "#b8c1ec", fontSize: "1.1rem", marginBottom: 8 }}>
          ✍️ Author: {book.author}
        </p>
        <p
          style={{
            color: "#7fffd4",
            fontWeight: 600,
            fontSize: "1.1rem",
            marginBottom: 16,
          }}
        >
          💰 Price: ₹{book.price}
        </p>
        <p style={{ marginTop: "20px", lineHeight: "1.6", color: "#eebbc3" }}>
          {book.desc}
        </p>

        <button
          onClick={() => addToCart(book)}
          style={{
            padding: "12px 24px",
            marginTop: "28px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#3b4a6b",
            color: "#a3bffa",
            fontWeight: "bold",
            fontSize: "1.1rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px #1a223f",
            transition: "background 0.15s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#232946")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#3b4a6b")
          }
        >
          Add to Cart
        </button>

        <div style={{ marginTop: "28px" }}>
          <Link
            to="/"
            style={{
              color: "#7fffd4",
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
