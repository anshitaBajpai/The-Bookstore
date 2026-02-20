import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import styles from "./BookCard.module.css";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext.jsx";

const BookCard = ({ book }) => {
  const { addToCart, cart } = useContext(CartContext);
  const navigate = useNavigate();

  const bookId = book.id || book._id;
  const cartItem = cart.find((item) => (item.id || item._id) === bookId);

  const remainingStock =
    Number(book.stock) - (cartItem ? cartItem.quantity : 0);

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const inWishlist = isInWishlist(book.id);

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  return (
    <div className={styles.card}>
      <div onClick={() => navigate(`/books/${bookId}`)}>
        <img src={book.image} alt={book.title} className={styles.image} />

        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>✍️ {book.author}</p>
        <p className={styles.price}>💰 ₹{book.price}</p>
      </div>

      <button
        onClick={() => addToCart(book)}
        disabled={remainingStock <= 0}
        className={`${styles.button} ${
          remainingStock <= 0 ? styles.disabled : ""
        }`}
      >
        {remainingStock <= 0 ? "Out of Stock" : "Add to Cart"}
      </button>

      <button className={styles.wishlistButton} onClick={handleWishlist}>
        {inWishlist ? "❤️ Remove" : "🤍 Wishlist"}
      </button>

      <p className={styles.stock}>
        Stock:{" "}
        {remainingStock > 0 ? (
          <span className={styles.inStock}>{remainingStock} Available</span>
        ) : (
          <span className={styles.outStock}>Out of stock</span>
        )}
      </p>
    </div>
  );
};

export default BookCard;
