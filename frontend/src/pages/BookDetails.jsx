import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";
import styles from "./BookDetails.module.css";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    let isMounted = true;

    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/books/${id}`);
        if (isMounted) {
          setBook(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch book details");
          setBook(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!book) return <p className={styles.notFound}>Book not found</p>;

  const bookId = book.id || book._id;
  const cartItem = cart.find((item) => (item.id || item._id) === bookId);
  const remainingStock = Number(book.stock) - (cartItem ? cartItem.quantity : 0);

  const handleAddToCart = () => {
    const qty = Math.max(1, Math.min(quantity, remainingStock));
    for (let i = 0; i < qty; i++) addToCart(book);
    setQuantity(1);
  };

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={styles.card}>
        <div className={styles.imageWrap}>
          <img src={book.image} alt={book.title} className={styles.image} />
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>by {book.author}</p>

          <div className={styles.metaRow}>
            <div className={styles.price}>₹{book.price}</div>
            {book.rating && <div className={styles.rating}>⭐ {book.rating}</div>}
            <div className={styles.category}>{book.category}</div>
          </div>

          <p className={styles.summary}>{book.summary}</p>

          <div className={styles.actionRow}>
            <div className={styles.qty}> 
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <input
                className={styles.qtyInput}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.min(q + 1, remainingStock))}
              >
                +
              </button>
            </div>

            <button
              className={styles.addButton}
              onClick={handleAddToCart}
              disabled={remainingStock <= 0}
            >
              {remainingStock <= 0 ? "Out of stock" : "Add to Cart"}
            </button>
          </div>

          <p className={styles.stock}>Available: {Math.max(0, remainingStock)}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
