import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import styles from "./Wishlist.module.css";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Your wishlist is empty 💔</h2>
        <p>Add books you love to see them here.</p>
        <button onClick={() => navigate("/")} className={styles.browseBtn}>
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Wishlist ❤️</h2>

      <div className={styles.grid}>
        {wishlist.map((book) => (
          <div key={book.id} className={styles.card}>
            <div onClick={() => navigate(`/books/${book.id}`)}>
              <img src={book.image} alt={book.title} className={styles.image} />

              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.author}>✍️ {book.author}</p>
              <p className={styles.price}>💰 ₹{book.price}</p>
            </div>

            <button
              className={styles.removeBtn}
              onClick={() => removeFromWishlist(book.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
