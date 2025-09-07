import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

const BookCard = ({ book }) => {
  const { addToCart } = useContext(CartContext);
  // Support both id and _id for book
  const bookId = book.id || book._id;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.1)",
        padding: "15px",
        borderRadius: "12px",
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}
    >
      <img src={book.image} alt={book.title} style={{ width: "150px", height: "200px", objectFit: "cover" }} />
      <h3>{book.title}</h3>
      <p>✍️ {book.author}</p>
      <p>💰 ₹{book.price}</p>
      <button
        onClick={() => addToCart(book)}
        style={{
          padding: "8px 12px",
          marginTop: "10px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#ffcc00",
          color: "#000",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default BookCard;
