import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import styles from "./Wishlist.module.css";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  if (wishlist.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Your wishlist is empty 💔</h2>
        <p>Browse books and add your favorites.</p>
        <Link to="/" className={styles.browseBtn}>
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Wishlist ❤️</h2>

      <div className={styles.grid}>
        {wishlist.map((book) => (
          <div key={book.id} className={styles.card}>
            <Link to={`/books/${book.id}`}>
              <img src={book.image} alt={book.title} className={styles.image} />
            </Link>

            <div className={styles.info}>
              <h3>{book.title}</h3>
              <p className={styles.author}>{book.author}</p>

              <div className={styles.actions}>
                <Link to={`/books/${book.id}`} className={styles.viewBtn}>
                  View Details
                </Link>

                <button
                  onClick={() => removeFromWishlist(book.id)}
                  className={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
