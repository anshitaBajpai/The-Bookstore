import React, { useContext, useEffect, useState } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config.js";
import styles from "./Wishlist.module.css";

function Wishlist() {
  const { wishlist, removeFromWishlist, addToWishlist } =
    useContext(WishlistContext);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (wishlist.length === 0) {
      axios
        .get(`${API_URL}/books`, { params: { limit: 8 } })
        .then((res) => {
          const books = Array.isArray(res.data)
            ? res.data
            : res.data.books || [];
          const shuffled = [...books].sort(() => Math.random() - 0.5);
          setSuggestions(shuffled.slice(0, 4));
        })
        .catch(() => {});
    }
  }, [wishlist.length]);

  if (wishlist.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyHero}>
          <div className={styles.emptyIcon}>🤍</div>
          <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
          <p className={styles.emptyText}>
            Save books you love to read them later.
          </p>
          <button onClick={() => navigate("/")} className={styles.browseBtn}>
            Browse All Books
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className={styles.suggestionsSection}>
            <h3 className={styles.suggestionsTitle}>Books you might like</h3>
            <div className={styles.suggestionsGrid}>
              {suggestions.map((book) => {
                const bookId = book.id || book._id;
                return (
                  <div key={bookId} className={styles.suggestionCard}>
                    <div
                      className={styles.suggestionImageWrap}
                      onClick={() => navigate(`/books/${bookId}`)}
                    >
                      <img
                        src={book.image}
                        alt={book.title}
                        className={styles.suggestionImage}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className={styles.suggestionInfo}>
                      <h4
                        className={styles.suggestionTitle}
                        onClick={() => navigate(`/books/${bookId}`)}
                      >
                        {book.title}
                      </h4>
                      <p className={styles.suggestionAuthor}>{book.author}</p>
                      <p className={styles.suggestionPrice}>₹{book.price}</p>
                      <button
                        className={styles.wishlistBtn}
                        onClick={() => addToWishlist(book)}
                      >
                        + Add to Wishlist
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
              <img
                src={book.image}
                alt={book.title}
                className={styles.image}
                loading="lazy"
                decoding="async"
              />
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
