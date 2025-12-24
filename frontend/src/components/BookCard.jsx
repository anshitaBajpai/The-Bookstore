import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

const BookCard = ({ book }) => {
  const { addToCart } = useContext(CartContext);
  // Support both id and _id for book
  const bookId = book.id || book._id;

  return (
    <div
      style={{
        background: "#b2f1e6",
        padding: "15px",
        borderRadius: "16px",
        border: "2px solid #43c6ac",
        boxShadow: "0 4px 18px #43c6ac33",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div>
        <img
          src={book.image}
          alt={book.title}
          style={{
            width: "150px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            background: "#e0ffef",
          }}
        />
        <h3 style={{ color: "#134e4a" }}>{book.title}</h3>
        <p style={{ color: "#134e4a", fontWeight: 500 }}>✍️ {book.author}</p>
        <p style={{ color: "#191654" }}>💰 ₹{book.price}</p>
      </div>
      <button
        onClick={() => addToCart(book)}
        disabled={book.stock === 0}
        style={{
          padding: "8px 12px",
          marginTop: "16px",
          border: "none",
          borderRadius: "8px",
          background: book.stock === 0 ? "#bdbdbd" : "#43c6ac",
          color: book.stock === 0 ? "#666" : "#134e4a",
          fontWeight: "bold",
          cursor: book.stock === 0 ? "not-allowed" : "pointer",
          transition: "background 0.2s, color 0.2s",
          opacity: book.stock === 0 ? 0.6 : 1,
        }}
        onMouseOver={(e) => {
          if (book.stock === 0) return;
          e.currentTarget.style.background = "#134e4a";
          e.currentTarget.style.color = "#43c6ac";
        }}
        onMouseOut={(e) => {
          if (book.stock === 0) return;
          e.currentTarget.style.background = "#43c6ac";
          e.currentTarget.style.color = "#134e4a";
        }}
      >
        {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>

      <p style={{ fontWeight: 600 }}>
        Stock:{" "}
        {book.stock > 0 ? (
          <span style={{ color: "green" }}>{book.stock} Available</span>
        ) : (
          <span style={{ color: "red" }}>Out of stock</span>
        )}
      </p>
    </div>
  );
};

export default BookCard;
